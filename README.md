# StegoSafe-CNS

A modern web application for audio and image steganography, built with React and TypeScript. StegoSafe-CNS allows you to securely embed, extract, and detect hidden messages in audio and image files directly in your browser—no server required!

## Features
- **Audio Steganography**: Hide and extract messages in WAV audio files using robust, noise-resistant algorithms.
- **Image Steganography**: Hide and extract messages in images (PNG, JPEG, etc.).
- **Detection**: Detect the presence of hidden messages in audio or image files.
- **AI Assistant**: Get help and learn about steganography with our Groq-powered chatbot.
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS for a clean, responsive experience.
- **All Local**: All processing is done in your browser for privacy and security (except for the AI chatbot).

## Project Structure
```
StegoSafe-CNS/
├── src/
│   ├── components/         # UI components
│   ├── context/            # React context providers
│   ├── pages/              # Main app pages (Embedding, Extraction, Detection, Home)
│   ├── utils/              # Steganography and utility functions
│   ├── workers/            # Web workers for heavy processing
│   └── ...
├── public/                 # Static assets
├── package.json            # Project metadata and scripts
├── tailwind.config.js      # Tailwind CSS config
├── vite.config.ts          # Vite build config
└── ...
```

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173)

## Environment Variables

Before getting started, you'll need to set up your environment variables:

1. Create a `.env` file in the root directory
2. Add your Groq API key:
   ```
   REACT_APP_GROQ_API_KEY=your_groq_api_key_here
   ```
   > Get your API key from [Groq's website](https://groq.com)

## Setup Instructions (After Cloning)

1. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Get a Groq API key from https://console.groq.com
   - Add your Groq API key to the `.env` file

2. **Install backend dependencies:**
   ```powershell
   npm install
   ```
2. **Start the backend server:**
   ```powershell
   node server.js
   ```
   - This will automatically create a new `users.db` SQLite database file if it does not exist.
3. **Sign up with a new email and password** using the signup page in your browser.
   - This will create your user account in the new database.
4. **Login** with your new credentials.

> **Note:**
> - The `users.db` file is not tracked by git and will not be present after cloning. It is created automatically by the backend.
> - If you do not run the backend, login and signup will not work.
> - You can inspect the database using the `sqlite3` CLI if needed.

## Usage
- Go to the Embedding page to hide a message in an audio or image file.
- Use the Extraction page to recover hidden messages.
- Use the Detection page to check if a file contains hidden content.

## Technologies Used
- React
- TypeScript
- Vite
- Tailwind CSS
- Web Audio API

## License
MIT
