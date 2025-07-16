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
import { getEvents, type Event } from '@/lib/data';
import {z} from 'genkit';

const EventAssistantInputSchema = z.object({
  userQuery: z.string().describe('The user query about the event.'),
  eventContext: z.any().optional().describe('The context of the specific event the user is currently viewing. This will be a JSON object with event details.'),
});
export type EventAssistantInput = z.infer<typeof EventAssistantInputSchema>;

const EventAssistantOutputSchema = z.object({
  answer: z.string().describe('A general answer to the user query if specific details are not requested or cannot be found.'),
  benefits: z.string().optional().describe("A summary of how this event will help the attendee and what its key benefits are."),
  skillsLearned: z.array(z.string()).optional().describe("A list of specific skills the attendee will learn."),
  prerequisites: z.string().optional().describe("A summary of any prerequisite knowledge or skills needed to get the most out of this event. If none, state that."),
});
export type EventAssistantOutput = z.infer<typeof EventAssistantOutputSchema>;

export async function eventAssistant(input: EventAssistantInput): Promise<EventAssistantOutput> {
  return eventAssistantFlow(input);
}

const getEventInformation = ai.defineTool(
  {
    name: 'getEventInformation',
    description: 'Get information about all available tech events. Use this tool to answer any questions about event schedules, topics, speakers, or details, especially if the user asks about an event other than the one they are currently viewing.',
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
  Your goal is to answer user questions about tech events.

  {{#if eventContext}}
  The user is currently viewing the following event. Prioritize answering questions about this event unless the user asks about a different one.
  Event Context:
  \`\`\`json
  {{{jsonStringify eventContext}}}
  \`\`\`
  {{/if}}
  
  When a user asks a question, first check if it can be answered using the provided Event Context. If they ask about a different event or a general question (e.g., "list all events"), use the getEventInformation tool to find the relevant event details.
  
  If the user asks a general question about the event (e.g., "what is this event about?", "tell me more"), analyze the event description and provide a comprehensive overview by filling out the 'benefits', 'skillsLearned', and 'prerequisites' fields in the output.
  
  - For 'benefits', explain the value proposition of the event for an attendee.
  - For 'skillsLearned', list the key skills that will be taught.
  - For 'prerequisites', describe the ideal background for an attendee. If none are mentioned, explicitly state that it's open to all levels.
  - For 'answer', provide a conversational response summarizing the information, or directly answer a specific question if asked.

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
