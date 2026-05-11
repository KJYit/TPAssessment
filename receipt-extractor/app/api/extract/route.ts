import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('receipt') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Convert the file to a base64 string for the AI API
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString('base64');

        const systemPrompt = `You are a receipt data extraction assistant.
        Your job is to read receipt images and return ONLY a valid JSON object — no explanation, no markdown, no extra text.
        Always return all four fields. If a field cannot be found, return null for that field.`;

        const userPrompt = `Extract the following fields from this receipt image and return ONLY a JSON object:
        {
        "merchant_name": "<name of the store or business>",
        "date": "<date of the transaction, in YYYY-MM-DD format if possible>",
        "total_amount": "<the final total amount paid, as a number string e.g. '42.50'>",
        "currency": "<currency code or symbol e.g. 'USD', 'MYR', 'CHF', 'RM'>"
        }

        Return ONLY the JSON. No explanation. No markdown code blocks.`;

        const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite', systemInstruction: systemPrompt });

        const result = await model.generateContent([
            userPrompt,
            { inlineData: { data: base64Image, mimeType: file.type } },
        ]);

        const responseText = result.response.text();
        // Clean up markdown code blocks if the AI accidentally includes them
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const extractedData = JSON.parse(cleanJson);

        return NextResponse.json(extractedData);
    } catch (error) {
        console.error('Extraction error:', error);
        return NextResponse.json({
            error: 'Failed to process receipt',
            detail: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}