import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const rateData = rateLimitMap.get(ip) || { count: 0, resetTime: now + 86400000 }; // 24 hours

    if (now > rateData.resetTime) {
      rateData.count = 0;
      rateData.resetTime = now + 86400000;
    }
    if (rateData.count >= 30) {
      return NextResponse.json({ error: 'Too many requests. Limit is 30 polishes per day.' }, { status: 429 });
    }
    rateData.count++;
    rateLimitMap.set(ip, rateData);

    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text content is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your-gemini-api-key') {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an elite resume builder and recruiter coach.
      Polish and rewrite the following experience bullet point or project description to make it highly professional, impact-driven, and impressive to technical recruiters.
      
      Guidelines:
      - Use strong, action-oriented verbs at the beginning of bullet points (e.g., "Architected," "Optimized," "Spearheaded").
      - Emphasize accomplishments, impact, and scale.
      - Ensure the output is concise, clear, and grammatically perfect.
      - Keep it as a direct bullet list or concise statement (matching the format of the input).
      - Do not invent any new facts, metrics, or credentials, but rephrase existing ones to sound highly professional.
      
      Input Text:
      """
      ${text}
      """
      
      Provide ONLY the polished text without any additional conversational introduction or markdown wrapper blocks.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const resultText = response.text;
    if (!resultText) {
      return NextResponse.json({ error: 'Failed to generate polished text from Gemini' }, { status: 500 });
    }

    return NextResponse.json({ polishedText: resultText.trim() });
  } catch (error: any) {
    console.error('Error in polish route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during polishing' },
      { status: 500 }
    );
  }
}
