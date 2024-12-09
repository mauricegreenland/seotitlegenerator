import { GoogleGenerativeAI } from '@google/generative-ai';
import { canMakeQuery, incrementQueryCount } from './queryCounter';
import { openAIService } from './openai';
import { validateInput } from '../utils/validation';

const API_KEY = 'AIzaSyB-mbtvvT-za3GLMET4QNt51qmdwpK9MxY';
const MODEL_NAME = 'gemini-pro';

const genAI = new GoogleGenerativeAI(API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: MODEL_NAME });

export async function generateSEOTitles(
  topic: string, 
  existingTitles: string[] = [], 
  model: string = 'default',
  apiKey: string = ''
): Promise<string[]> {
  if (model === 'default' && !canMakeQuery()) {
    throw new Error('Query limit reached. Please try again after the reset period.');
  }

  if (model !== 'default' && !apiKey) {
    throw new Error('API key is required for the selected model.');
  }

  try {
    const validatedTopic = validateInput(topic);

    if (model === 'gpt4') {
      openAIService.initialize(apiKey);
      const titles = await openAIService.generateTitles(validatedTopic, existingTitles);
      return titles;
    }

    let attempts = 0;
    const maxAttempts = 3;
    let allTitles: string[] = [];

    while (attempts < maxAttempts && allTitles.length < 8) {
      const prompt = `Generate 8 unique SEO-optimized meta titles for the topic: "${validatedTopic}"
${existingTitles.length > 0 ? `\nExclude these existing titles:\n${existingTitles.join('\n')}` : ''}
${allTitles.length > 0 ? `\nExclude these titles:\n${allTitles.join('\n')}` : ''}

Requirements:
- Each title MUST be between 50-60 characters (inclusive)
- Start each title with a word (no numbers, bullets, or special characters)
- No quotation marks around titles
- One title per line
- Plain text only, no formatting
- Use diverse tones (casual, professional, enthusiastic, etc.)
- Include action words and specific timeframes where appropriate
- Focus on clear value propositions
- Match search intent (informational, transactional, etc.)`;

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const newTitles = text
        .split('\n')
        .map(title => title.trim())
        .map(title => title
          .replace(/^[-\d.\s"]+/, '')
          .replace(/^[^a-zA-Z0-9]+/, '')
          .replace(/["]+/g, '')
          .replace(/\s+/g, ' ')
        )
        .filter(title => {
          const length = title.length;
          return (
            title &&
            length >= 50 && 
            length <= 60 && 
            !existingTitles.includes(title) && 
            !allTitles.includes(title)
          );
        });

      allTitles = [...allTitles, ...newTitles];

      if (allTitles.length >= 8) {
        break;
      }

      attempts++;
    }

    if (allTitles.length < 8) {
      throw new Error('Unable to generate enough unique titles. Please try with more specific keywords.');
    }

    if (model === 'default') {
      incrementQueryCount();
    }
    
    return allTitles.slice(0, 8);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
}