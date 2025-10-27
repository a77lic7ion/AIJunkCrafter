# Junk Art Genius: Creative Craft Creator

**Turn your clutter into creative crafts for kids!**

Junk Art Genius is a web application that uses the power of the Google Gemini API to transform photos of everyday household junk into fun, imaginative craft projects for children. Just snap a picture of some random items, and let the AI generate a complete, step-by-step guide to creating something amazing.

![Junk Art Genius Screenshot](https://storage.googleapis.com/aistudio-project-images/2237885b-381a-4c2f-b40b-f4fd624b4233.png)

## ✨ Key Features

*   **🤖 AI-Powered Idea Generation:** Leverages Google's `gemini-2.5-flash` model to analyze an image of items and generate a unique craft idea.
*   **🎨 Illustrated Instructions:** Uses the `gemini-2.5-flash-image` model to create custom, cartoon-style illustrations for each step, making the instructions visual and easy for kids to follow.
*   **📸 Camera & File Upload:** Easily capture photos of your items directly with your device's camera or upload an existing image.
*   **🛠️ Supply Customization:** Specify which extra supplies (like glue, scissors, or paint) you have on hand to get more tailored project ideas.
*   **💡 User-Guided Creativity:** Have a specific idea in mind? You can provide a custom prompt (e.g., "a rocket ship") to guide the AI's creation process.
*   **💾 Saved Ideas Gallery:** Save your favorite craft ideas to a personal gallery. View, manage, and delete them from a dedicated "Saved Ideas" page.
*   **📄 Export to PDF:** Download any craft idea as a high-quality, multi-page PDF, complete with images and instructions. Perfect for printing or offline viewing.
*   **🔗 Shareable Content:** Easily share the text-based instructions for any craft idea with friends and family using the native Web Share API or by copying to the clipboard.
*   **⚙️ Advanced AI Settings:** For enthusiasts, the app provides a settings popover to adjust the AI's generation parameters (`temperature`, `topK`, `topP`) to control its level of creativity.
*   **📱 Responsive & Fun UI:** A playful and colorful interface built with React and Tailwind CSS that works beautifully on both desktop and mobile devices.

## 🚀 How It Works

1.  **Snap or Upload:** Use the "Use Camera" or "Upload Photo" button to provide an image of the items you want to repurpose.
2.  **Customize (Optional):** Tell the AI what extra supplies you have available or type in your own idea to guide the generation.
3.  **Generate Idea:** Click the "Generate Idea" button. The app sends the image and your preferences to the Gemini API.
4.  **Get Your Project:** In moments, you'll receive a complete project with a title, a list of materials, and illustrated step-by-step instructions.
5.  **Save, Share, or Export:**
    *   Click **"Save Idea"** to add it to your personal gallery.
    *   Click **"Share"** to send the instructions to others.
    *   Click **"Export PDF"** to download a printable version.

## 🛠️ Tech Stack

*   **Frontend:** React, TypeScript
*   **Styling:** Tailwind CSS
*   **AI Models:** Google Gemini API
    *   **Text Generation:** `gemini-2.5-flash` for creating the craft idea's structure (title, materials, steps).
    *   **Image Generation:** `gemini-2.5-flash-image` for creating the step-by-step illustrations.
*   **PDF Generation:** `jspdf` & `html2canvas`

## 🚀 Deployment & API Key

This application requires a Google Gemini API key to function. The key must be provided as an environment variable named `API_KEY` in the execution environment.

### Deploying on Vercel

When deploying to a platform like Vercel, you must configure your API key in the project settings for the application to work correctly.

1.  Navigate to your project's dashboard on the Vercel website.
2.  Go to the **Settings** tab.
3.  In the side menu, click on **Environment Variables**.
4.  Add a new variable:
    *   **Key:** `API_KEY`
    *   **Value:** Paste your Google Gemini API key here.
5.  Ensure the variable is available to all environments (Production, Preview, and Development).
6.  After saving, you may need to redeploy your project for the changes to take effect. Go to the **Deployments** tab and trigger a new deployment.

## 📁 Project Structure

```
/
├── index.html                # Main HTML entry point
├── index.tsx                 # Root React component
├── App.tsx                   # Main application component, state management
├── metadata.json             # App metadata and permissions
├── Readme.md                 # This file
├── components/               # Reusable React components
│   ├── Header.tsx
│   ├── ImageUploader.tsx
│   ├── ResultDisplay.tsx
│   ├── SavedIdeasPage.tsx
│   └── ...
└── services/                 # Logic for interacting with external APIs
    ├── geminiService.ts      # Handles all calls to the Gemini API
    └── pdfService.ts         # Handles PDF export functionality
```