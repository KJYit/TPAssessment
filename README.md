# AI Receipt Extractor

An intelligent web application built with Next.js and Google's Generative AI (Gemini) that automatically extracts key information from receipt images. 

## Features

- **Image Upload:** Simple drag-and-drop or click-to-upload interface for receipt images (PNG, JPG, JPEG).
- **Automated AI Extraction:** Uses the `gemini-3.1-flash-lite` model to intelligently parse the receipt and extract:
  - Merchant Name
  - Transaction Date
  - Total Amount
  - Currency
- **Review & Edit:** Presents the extracted data in an editable form, allowing users to verify and correct any details before saving.
- **Saved Receipts:** Keeps track of confirmed receipts in a clean, visual grid for easy reference.

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API Routes
- **AI Integration:** Google Generative AI SDK (`@google/generative-ai`)

## AI Model & Prompts

This project utilizes the **Gemini 3.1 Flash Lite** (`gemini-3.1-flash-lite`) model to analyze and extract data from the receipt images.

**System Prompt:**
```text
You are a receipt data extraction assistant.
Your job is to read receipt images and return ONLY a valid JSON object — no explanation, no markdown, no extra text.
Always return all four fields. If a field cannot be found, return null for that field.
```

**User Prompt:**
```text
Extract the following fields from this receipt image and return ONLY a JSON object:
{
"merchant_name": "<name of the store or business>",
"date": "<date of the transaction, in YYYY-MM-DD format if possible>",
"total_amount": "<the final total amount paid, as a number string e.g. '42.50'>",
"currency": "<currency code or symbol e.g. 'USD', 'MYR', 'CHF', 'RM'>"
}

Return ONLY the JSON. No explanation. No markdown code blocks.
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, pnpm, or bun
- A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KJYit/TPAssessment.git
   cd TPAssessment/receipt-extractor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root of your project and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

## Usage

1. Click on the upload area or drag and drop a receipt image into the designated box.
2. Wait a moment for the AI to analyze the receipt and extract the data.
3. Review the extracted details (Merchant Name, Date, Total Amount, Currency) in the form below.
4. Make any necessary corrections to the fields.
5. Click "Confirm & Save Receipt" to save the data.
6. The saved receipt will appear in the "Saved Receipts" section at the bottom of the page.

## Acknowledgements

The receipt images used for testing and development in this project were sourced from the [OCR Receipts Text Detection dataset](https://www.kaggle.com/datasets/trainingdatapro/ocr-receipts-text-detection) on Kaggle, provided by TrainingDataPro.
