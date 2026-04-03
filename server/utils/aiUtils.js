/** @format */

const aiCooldownMap = new Map();
const inFlight = new Map();

/**
 * Checks if the user is allowed to call the AI endpoint for a given key.
 * Cooldown defaults to 15 seconds.
 */
function canCallAI(userId, key, cooldownMs = 15000) {
	const now = Date.now();
	const mapKey = `${userId}:${key}`;
	const lastCall = aiCooldownMap.get(mapKey);

	if (lastCall && now - lastCall < cooldownMs) {
		return false;
	}

	aiCooldownMap.set(mapKey, now);
	return true;
}

/**
 * Ensures only one concurrent request runs for a specific key.
 */
async function runOnce(key, fn) {
	if (inFlight.has(key)) {
		return inFlight.get(key);
	}

	const promise = fn().finally(() => {
		inFlight.delete(key);
	});
	inFlight.set(key, promise);
	return promise;
}

/**
 * Retries a Gemini model.generateContent call with backoff on 429 or quota errors.
 */
async function generateWithRetry(model, payload, retries = 3) {
	let attempt = 0;

	while (attempt <= retries) {
		try {
			// Using spread for array payloads, otherwise pass directly.
			if (Array.isArray(payload)) {
				return await model.generateContent(payload);
			}
			return await model.generateContent(payload);
		} catch (err) {
			const msg = err?.message || err?.statusText || "";
			const isRateLimit = msg.includes("429") || msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("too many requests");

			let delay = 2000 * (attempt + 1);
			let isDailyQuotaExhausted = false;

			// Attempt to extract the dynamic retry delay from Google's error
			try {
				const errorDetails = err?.errorDetails || (err?.response?.data?.error?.details);
				if (Array.isArray(errorDetails)) {
					// Check for Daily Quota Exhaustion
					const quotaInfo = errorDetails.find(d => d && d['@type'] === 'type.googleapis.com/google.rpc.QuotaFailure');
					if (quotaInfo && quotaInfo.violations) {
						const isDaily = quotaInfo.violations.some(v => v.quotaId && v.quotaId.includes('PerDay'));
						if (isDaily) {
							isDailyQuotaExhausted = true;
						}
					}
					
					const retryInfo = errorDetails.find(d => d && d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo');
					if (retryInfo && retryInfo.retryDelay) {
						const seconds = parseInt(retryInfo.retryDelay.replace(/[^\d.]/g, ''), 10);
						if (!isNaN(seconds) && seconds > 0) {
							delay = (seconds * 1000) + 1000; // Add 1s buffer
						}
					}
				}
			} catch (e) {
				// Ignore parsing errors
			}

			if (isDailyQuotaExhausted) {
				err.isDailyQuota = true;
				throw err;
			}

			// Fallback: check error message for "Please retry in X s." format
			try {
				const match = msg.match(/Please retry in ([\d.]+)s/i);
				if (match && match[1]) {
					const seconds = parseFloat(match[1]);
					if (!isNaN(seconds) && seconds > 0) {
						delay = Math.max(delay, (seconds * 1000) + 1000);
					}
				}
			} catch (e) {
				// Ignore
			}

			if (!isRateLimit || attempt >= retries) {
				throw err;
			}

			// Cap the delay at a reasonable value so the frontend doesn't timeout completely (e.g., 60 seconds)
			delay = Math.min(delay, 60000);

			console.warn(`[AI] Rate limited. Retrying attempt ${attempt + 1}/${retries} after ${delay}ms...`);
			await new Promise((resolve) => setTimeout(resolve, delay));
			attempt++;
		}
	}
}

module.exports = { canCallAI, runOnce, generateWithRetry };
