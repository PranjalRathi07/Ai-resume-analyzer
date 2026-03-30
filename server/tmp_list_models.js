require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

async function listAllModels() {
  try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + process.env.GEMINI_API_KEY);
      const data = await response.json();
      fs.writeFileSync("models.json", JSON.stringify(data.models.map(m => m.name), null, 2));
      console.log("Done");
  } catch(e) {
      console.error(e);
  }
}
listAllModels();
