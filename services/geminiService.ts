import { GoogleGenAI, Type } from "@google/genai";
import { ProjectIdea } from '../types';

export const getProjectIdeas = async (
  major: string,
  specialization: string,
  skills: string | string[]
): Promise<ProjectIdea[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const formatSkills = (skills: string | string[]): string => {
    if (Array.isArray(skills)) {
      return skills.join(', ');
    }
    return skills;
  };

  const prompt = `
    Generate 4 innovative and practical group project ideas for a university student.
    Student Profile:
    - Major: ${major}
    - Specialization: ${specialization}
    - Key Skills: ${formatSkills(skills) || 'Not specified'}

    Each project should be suitable for a small team and completable within a semester.
    For each project, provide:
    - A catchy title
    - A one-sentence description of the project goal
    - A scope section (2-3 sentences explaining project scope and deliverables)
    - A suggested technology stack (recommended tools, frameworks, or languages)
    - A difficulty level (Beginner, Intermediate, or Advanced)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            project_ideas: {
              type: Type.ARRAY,
              description: 'A list of 4 project ideas.',
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: 'The catchy title of the project.',
                  },
                  description: {
                    type: Type.STRING,
                    description: 'A brief, one-sentence description of the project goal.',
                  },
                  scope: {
                    type: Type.STRING,
                    description: '2-3 sentences explaining project scope and deliverables.',
                  },
                  suggestedStack: {
                    type: Type.STRING,
                    description: 'Recommended tools, frameworks, or languages.',
                  },
                  difficulty: {
                    type: Type.STRING,
                    description: 'The difficulty level: Beginner, Intermediate, or Advanced.',
                  },
                },
                required: ['title', 'description', 'scope', 'suggestedStack', 'difficulty'],
              },
            },
          },
          required: ['project_ideas'],
        },
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        console.error("Gemini API returned an empty response.");
        return [];
    }

    const parsedResponse = JSON.parse(jsonText);
    return (parsedResponse.project_ideas || []) as ProjectIdea[];
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        console.error("Underlying error message:", error.message);
    }
    throw new Error("Failed to generate or parse project ideas from the Gemini API.");
  }
};