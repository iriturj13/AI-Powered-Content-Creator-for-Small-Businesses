# **SocialSip: Ethical AI Marketing Suite**  
*Generate engaging social content and ensure brand safety with Gemini 2.5 Flash.*

---

## 🚀 Overview

**SocialSip** is a dual-purpose web application designed to help small businesses create high-quality, responsible social media content. Built with **Google Gemini 2.5 Flash** and **Gemini 2.5 Flash Image**, it tackles two major challenges in digital marketing:

1. **Creativity Block** — generating compelling captions and visual ideas  
2. **Brand Safety** — ensuring content is ethical, inclusive, and free of bias

With integrated creation + auditing workflows, SocialSip acts as both a **creative partner** and a **responsible AI checker**, making social media marketing faster, safer, and more accessible.

---

## ✨ Features

### **🎨 Generator Mode — Create Stunning Social Content**
- Generates Instagram-ready captions with emojis + hashtags  
- Produces AI-driven “visual concepts” using multimodal reasoning  
- Tailors tone, vibe, and marketing style to product inputs  
- Uses JSON Schema to ensure clean, predictable marketing output

### **🛡️ Auditor Mode — Ensure Content is Safe & Inclusive**
- Scans captions for bias, harmful phrasing, or misleading claims  
- Suggests safer revisions aligned with Responsible AI principles  
- Batch-audits multiple past posts in a single request  
- Uses a specialized “Google Responsible AI Auditor” system instruction

### **🖼️ Multimodal Product Mockups**
- Dynamically builds prompts for **gemini-2.5-flash-image**  
- Creates quick visual mockups that match generated captions  
- Helps small businesses visualize their brand instantly

---

## 🧠 Tech Stack

- **Frontend:** React + Tailwind CSS  
- **AI Models:** Gemini 2.5 Flash, Gemini 2.5 Flash Image  
- **Integration:** Google GenAI SDK  
- **Output Enforcement:** JSON Schema  
- **Other:** Vite, Zustand (optional), Netlify/Vercel deployment compatible

---

## 🏗️ How It Works

### **1. Structured Generation**
Gemini 2.5 Flash returns standardized marketing outputs using enforced schemas:

```json
{
  "title": "",
  "caption": "",
  "hashtags": []
}
```
This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1roBys4lmLqUZv89Skwsv-6pEyHeiYb4d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
