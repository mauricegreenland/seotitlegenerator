import OpenAI from 'openai';
import { cleanTitle } from '../utils/titleCleaner';

export class OpenAIService {
  private client: OpenAI | null = null;

  initialize(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async generateTitles(topic: string, existingTitles: string[] = []): Promise<string[]> {
    if (!this.client) {
      throw new Error('OpenAI client not initialized. Please provide an API key.');
    }

    try {
      let attempts = 0;
      const maxAttempts = 3;
      let allTitles: string[] = [];

      while (attempts < maxAttempts && allTitles.length < 8) {
        const response = await this.client.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an AI specialized in generating SEO-optimized meta titles. Generate exactly 8 unique titles.

CRITICAL REQUIREMENTS:
- Each title MUST be between 50-60 characters
- Return plain text only, one title per line
- NO numbers, bullets, quotes, or special characters at the start
- NO formatting or prefixes of any kind
- NO quotation marks around titles
- Use diverse tones (casual, professional, enthusiastic, etc.)
- Include action words and specific timeframes
- Focus on clear value propositions
- Match search intent (informational, transactional, etc.)

Example correct output:
Master Content Creation: 5-Minute Guide to Success in 2024
Quick Guide to SEO: Boost Your Website Traffic in 30 Days
Professional Marketing Strategies: Step-by-Step Blueprint`
            },
            {
              role: 'user',
              content: `Topic: "${topic}"
${existingTitles.length > 0 ? `\nExclude these titles:\n${existingTitles.join('\n')}` : ''}
${allTitles.length > 0 ? `\nExclude these titles:\n${allTitles.join('\n')}` : ''}

Generate ${8 - allTitles.length} unique SEO titles.
Remember: 50-60 characters each, no formatting.`
            }
          ],
          temperature: 0.8,
          max_tokens: 1000,
          frequency_penalty: 0.5,
          presence_penalty: 0.3
        });

        const newTitles = response.choices[0]?.message?.content
          ?.split('\n')
          .map(cleanTitle)
          .filter(title => {
            const length = title.length;
            return (
              title &&
              length >= 50 && 
              length <= 60 && 
              !existingTitles.includes(title) && 
              !allTitles.includes(title)
            );
          }) || [];

        allTitles = [...allTitles, ...newTitles];

        if (allTitles.length >= 8) {
          break;
        }

        attempts++;
      }

      if (allTitles.length < 8) {
        throw new Error('Unable to generate enough unique titles. Please try with more specific keywords.');
      }

      return allTitles.slice(0, 8);
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        switch (error.status) {
          case 401:
            throw new Error('Invalid API key. Please check your settings and try again.');
          case 429:
            throw new Error('Rate limit exceeded. Please try again later.');
          case 500:
            throw new Error('OpenAI service error. Please try again later.');
          default:
            throw new Error(`OpenAI API error: ${error.message}`);
        }
      }
      throw error;
    }
  }
}

export const openAIService = new OpenAIService();