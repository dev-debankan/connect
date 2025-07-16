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
import { getEvents } from '@/lib/data';
import {z} from 'genkit';

const EventAssistantInputSchema = z.object({
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

const getEventInformation = ai.defineTool(
  {
    name: 'getEventInformation',
    description: 'Get information about all available tech events. Use this tool to answer any questions about event schedules, topics, speakers, or details.',
    inputSchema: z.object({
      title: z.string().optional().describe('The title of a specific event to get information for.'),
    }),
    outputSchema: z.any(),
  },
  async (input) => {
    const allEvents = getEvents();
    if (input.title) {
      const foundEvent = allEvents.find(e => e.title.toLowerCase().includes(input.title!.toLowerCase()));
      return foundEvent || `No event found with title containing "${input.title}".`;
    }
    // Return all details for all events
    return allEvents.map(e => ({ 
      title: e.title, 
      speaker: e.speaker, 
      time: e.time.toISOString(), 
      topic: e.topic,
      description: e.description,
      category: e.category,
    }));
  }
);


const prompt = ai.definePrompt({
  name: 'eventAssistantPrompt',
  input: {schema: EventAssistantInputSchema},
  output: {schema: EventAssistantOutputSchema},
  tools: [getEventInformation],
  prompt: `You are a friendly and helpful AI event assistant for GDG Connect Streamline.
  Your goal is to answer user questions about tech events based on the information provided by the getEventInformation tool.
  When a user asks a question (e.g., "who is the speaker for the Next.js event?", "what is the description of the AI with Gemini workshop?", "When is the event on Firebase?"), use the tool to find the relevant event details and formulate a clear and concise answer.
  If the user asks a general question, you can list the available events.
  
  User Query: {{{userQuery}}}`,
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
