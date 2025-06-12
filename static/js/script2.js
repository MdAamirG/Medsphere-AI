import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const safetySetting = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

const apiKey = "AIzaSyBDBiN-8YJ3spxXzFTH4g5k28-d0A82tHs";
const genAI = new GoogleGenerativeAI(apiKey);

// Converts a File object to a GoogleGenerativeAI.Part object.
async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

function convertMarkdownToHTML(text) {
  // Convert `**bold**` to `<strong>bold</strong>`
  text = text.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return text;
}

function sanitizeHTML(text) {
  // Simple sanitization to remove potentially harmful HTML tags
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function run(event) {
  event.preventDefault(); // Prevent the form from submitting normally

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySetting });
  const prompt = `You are being evaluated for your analytical abilities in reviewing patient data to assist a healthcare professional. The information provided is purely fictional and is for testing purposes only.

You will be given an image from a patient case. Based on the image:
Summarize the key observations from the image that may be relevant for identifying potential health conditions or abnormalities.
For each observation, explain why it might be significant in understanding the issue or informing further investigation.
Generate a list of potential factors or conditions that could explain the observations.
For each factor, list any tests or additional data that could be needed to confirm or rule it out, and note if this data is already available.
Based on the available information, suggest a hypothesis about the most likely condition and outline next steps or procedures that might be helpful for further investigation.`;

  const fileInputEl = document.querySelector("#fileInput");
  const imageParts = await Promise.all(
    [...fileInputEl.files].map(fileToGenerativePart)
  );

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = await response.text();
  console.log(text);

  const resultDiv = document.querySelector("#resultContent");
  resultDiv.innerHTML = convertMarkdownToHTML(sanitizeHTML(text));
}

// Add event listener to the form
document.querySelector("#uploadForm").addEventListener("submit", run);