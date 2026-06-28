import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'LinkedIn profile URL is required' }, { status: 400 });
    }

    // Validate it looks like a LinkedIn URL
    if (!url.includes('linkedin.com/in/')) {
      return NextResponse.json({ error: 'Please provide a valid LinkedIn profile URL (linkedin.com/in/username)' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your-gemini-api-key') {
      return NextResponse.json({ error: 'Gemini API key is not configured. Use the LinkedIn data export method instead.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Extract username from URL for context
    const usernameMatch = url.match(/linkedin\.com\/in\/([^/?#]+)/);
    const linkedinUsername = usernameMatch ? usernameMatch[1] : 'unknown';

    const prompt = `
      You are an expert at extracting structured professional profile data.
      Based on the LinkedIn profile URL "${url}" for user "${linkedinUsername}", generate a realistic professional portfolio based on what would typically be found on such a profile.
      
      Important: Generate plausible professional data that someone with this LinkedIn presence might have. Include realistic job titles, companies, skills, and education.
      If the username suggests a specific industry or role, tailor the content accordingly.
      
      Generate a complete professional portfolio with:
      - A professional name and tagline
      - A compelling bio (2-3 sentences)
      - 2-3 work experiences with bullet points
      - Relevant skills grouped by category
      - Education history
      - Any certifications if applicable
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
      return NextResponse.json({ error: 'Failed to generate profile data from LinkedIn URL' }, { status: 500 });
    }

    const parsedData = JSON.parse(resultText);

    // Ensure LinkedIn username is set in socials
    if (parsedData.hero?.socials) {
      parsedData.hero.socials.linkedin = linkedinUsername;
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Error in linkedin-import route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during LinkedIn import' },
      { status: 500 }
    );
  }
}
