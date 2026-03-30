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
async function generateWithRetry(model, payload, retries = 2) {
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

			if (!isRateLimit || attempt === retries) {
				throw err;
			}

			const delay = 2000 * (attempt + 1);
			console.warn(`[AI] Rate limited. Retrying attempt ${attempt + 1}/${retries} after ${delay}ms...`);
			await new Promise((resolve) => setTimeout(resolve, delay));
			attempt++;
		}
	}
}

module.exports = { canCallAI, runOnce, generateWithRetry };
