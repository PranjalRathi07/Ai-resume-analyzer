/** @format */
const fs = require("fs");

async function extractTextFromPDF(filePath) {
	try {
		// pdf-parse needs the buffer
		const pdfParse = require("pdf-parse");
		const dataBuffer = fs.readFileSync(filePath);
		const data = await pdfParse(dataBuffer);
		return data.text || "";
	} catch (err) {
		console.error("PDF extraction error:", err.message);
		return "";
	}
}

module.exports = { extractTextFromPDF };
