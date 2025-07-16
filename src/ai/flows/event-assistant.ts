// src/ai/flows/event-assistant.ts
'use server';
/**
 * @fileOverview An AI event assistant that provides event-specific information.
 *
 * - eventAssistant - A function that handles the event assistance process.
 * - EventAssistantInput - The input type for the eventAssistant function.
 * - EventAssistantOutput - The return type for the eventAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EventAssistantInputSchema = z.object({
  eventDetails: z
    .string()
    .describe('The details of the event, including title, speaker, time, and topic.'),
  userQuery: z.string().describe('The user query about the event.'),
});
export type EventAssistantInput = z.infer<typeof EventAssistantInputSchema>;

const EventAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query based on the event details.'),
});
export type EventAssistantOutput = z.infer<typeof EventAssistantOutputSchema>;

export async function eventAssistant(input: EventAssistantInput): Promise<EventAssistantOutput> {
  return eventAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'eventAssistantPrompt',
  input: {schema: EventAssistantInputSchema},
  output: {schema: EventAssistantOutputSchema},
  prompt: `You are an AI event assistant. You have information about an event.
  The event details are as follows:
  {{eventDetails}}

  A user has the following query about the event:
  {{userQuery}}

  Answer the user's query based on the event details.`,
});

const eventAssistantFlow = ai.defineFlow(
  {
    name: 'eventAssistantFlow',
    inputSchema: EventAssistantInputSchema,
    outputSchema: EventAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
