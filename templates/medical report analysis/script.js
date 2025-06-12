import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const safetySetting = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const apiKey = "AIzaSyBDBiN-8YJ3spxXzFTH4g5k28-d0A82tHs";
const genAI = new GoogleGenerativeAI(apiKey);

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
  text = text.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return text;
}

function sanitizeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function run(event) {
  event.preventDefault();

  // Show the loading spinner
  document.getElementById('loadingSpinner').style.display = 'block';

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySetting });
  const prompt = `You are being evaluated for your quality as an assistant to a Doctor.
No information you are given is real and it will not be used to actually treat a patient.
You will be given a summary of a patient encounter and it is your job to:
  1. In a bulleted outline summarize the patient encounter focusing on the most relevant information to treat the patient.
     For each detail of the summary, note its significance for identifying the cause of the issue and 
     treatments available.
  2. Generate a bulleted list of the possible causes of the patient's issue. 
     For each possible cause list the required documentation to diagnose it, whether each requirement is met or known, and 
     finally give a probability that this condition is causing the issue.
  3. Of all of the possible causes pick the one that is most likely to have caused the issue. Come up with a treatment plan for the patient.`;

  const fileInputEl = document.querySelector("#fileInput");
  const imageParts = await Promise.all([...fileInputEl.files].map(fileToGenerativePart));

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = await response.text();
  console.log(text);

  const resultDiv = document.querySelector("#resultContent");
  resultDiv.innerHTML = convertMarkdownToHTML(sanitizeHTML(text));

  // Hide the loading spinner
  document.getElementById('loadingSpinner').style.display = 'none';
}

document.querySelector("#uploadForm").addEventListener("submit", run);
