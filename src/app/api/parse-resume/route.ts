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
    if (rateData.count >= 10) {
      return NextResponse.json({ error: 'Too many requests. Limit is 10 resumes per day.' }, { status: 429 });
    }
    rateData.count++;
    rateLimitMap.set(ip, rateData);

    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text content is required' }, { status: 400 });
    }
    if (text.length > 50000) {
      return NextResponse.json({ error: 'Resume text is too long (max 50,000 chars).' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your-gemini-api-key') {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an expert recruiter and resume parser.
      Extract the professional profile details from the following resume text and format it exactly according to the requested JSON schema.
      
      Important guidelines:
      - Extract ALL sections: personal info, work experience, projects, skills, education, and certifications/awards.
      - For education, extract institution name, degree type, field of study, and date range.
      - For certifications, extract name, issuing organization, and date obtained.
      - Group skills into meaningful categories (e.g., Languages, Frameworks, Tools, Databases).
      - If social links (GitHub, LinkedIn, etc.) are present in the resume, extract them.
      - If any fields are missing, omit them or leave as empty strings/arrays.
      - Do not make up any information. Only extract what is present.
      
      Resume text:
      """
      ${text}
      """
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            hero: {
              type: 'OBJECT',
              properties: {
                name: { type: 'STRING' },
                tagline: { type: 'STRING' },
                bio: { type: 'STRING' },
                socials: {
                  type: 'OBJECT',
                  properties: {
                    github: { type: 'STRING' },
                    linkedin: { type: 'STRING' },
                    twitter: { type: 'STRING' },
                    website: { type: 'STRING' },
                    email: { type: 'STRING' },
                  }
                }
              },
              required: ['name', 'tagline', 'bio']
            },
            skills: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  category: { type: 'STRING' },
                  items: { type: 'ARRAY', items: { type: 'STRING' } }
                },
                required: ['category', 'items']
              }
            },
            projects: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  title: { type: 'STRING' },
                  description: { type: 'STRING' },
                  tech: { type: 'ARRAY', items: { type: 'STRING' } },
                  github: { type: 'STRING' },
                  live: { type: 'STRING' }
                },
                required: ['title', 'description', 'tech']
              }
            },
            experience: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  role: { type: 'STRING' },
                  company: { type: 'STRING' },
                  period: { type: 'STRING' },
                  bullets: { type: 'ARRAY', items: { type: 'STRING' } }
                },
                required: ['role', 'company', 'period', 'bullets']
              }
            },
            education: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  institution: { type: 'STRING' },
                  degree: { type: 'STRING' },
                  field: { type: 'STRING' },
                  period: { type: 'STRING' }
                },
                required: ['institution', 'degree', 'field', 'period']
              }
            },
            certifications: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  name: { type: 'STRING' },
                  issuer: { type: 'STRING' },
                  date: { type: 'STRING' },
                  url: { type: 'STRING' }
                },
                required: ['name', 'issuer', 'date']
              }
            }
          },
          required: ['hero', 'skills', 'projects', 'experience', 'education', 'certifications']
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      return NextResponse.json({ error: 'Failed to generate structured data from Gemini' }, { status: 500 });
    }

    const parsedData = JSON.parse(resultText);
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Error in parse-resume route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during parsing' },
      { status: 500 }
    );
  }
}
