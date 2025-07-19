import {genkit, GenkitPlugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const plugins: GenkitPlugin[] = [];

if (process.env.GOOGLE_API_KEY) {
  plugins.push(
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY,
    })
  );
}

export const ai = genkit({
  plugins,
  model: 'googleai/gemini-2.0-flash',
});
