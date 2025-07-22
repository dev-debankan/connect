'use server';
/**
 * @fileOverview An AI flow to generate an image for an event.
 *
 * - generateEventImage - A function that handles image generation.
 * - GenerateEventImageInput - The input type for the function.
 * - GenerateEventImageOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEventImageInputSchema = z.object({
  prompt: z.string().describe('A descriptive prompt for the image to be generated, usually based on the event title or topic.'),
});
export type GenerateEventImageInput = z.infer<typeof GenerateEventImageInputSchema>;

const GenerateEventImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateEventImageOutput = z.infer<typeof GenerateEventImageOutputSchema>;

export async function generateEventImage(input: GenerateEventImageInput): Promise<GenerateEventImageOutput> {
  return generateEventImageFlow(input);
}

const generateEventImageFlow = ai.defineFlow(
  {
    name: 'generateEventImageFlow',
    inputSchema: GenerateEventImageInputSchema,
    outputSchema: GenerateEventImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Create a professional, modern, and engaging banner image for a tech event titled: "${input.prompt}". The image should be abstract and visually appealing, suitable for a professional audience. Avoid using text in the image.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
        throw new Error('Image generation failed to return a data URI.');
    }

    return { imageDataUri: media.url };
  }
);
