
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
  eventContext: z.string().optional().describe('A JSON string of the specific event context the user is currently viewing.'),
});
export type EventAssistantInput = z.infer<typeof EventAssistantInputSchema>;

const EventAssistantOutputSchema = z.object({
  answer: z.string().describe('A conversational answer to the user query, synthesized from the event details.'),
  benefits: z.string().optional().describe("A summary of how this event will help the attendee and what its key benefits are."),
  skillsLearned: z.array(z.string()).optional().describe("A list of specific skills the attendee will learn, extracted from the event description."),
  prerequisites: z.string().optional().describe("A summary of any prerequisite knowledge or skills needed. If none are mentioned, state that it's open to all levels."),
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
    const allEvents = await getEvents();
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
  prompt: `You are an expert AI event assistant for GDG Connect Streamline. Your primary goal is to provide detailed, helpful, and specific answers to user questions about tech events in a conversational, full-sentence format.

IMPORTANT: Your response MUST be based on the provided event information. Do not use general knowledge.

0.  **Handle Greetings and Thanks**: First, check if the user is just saying hello or thanks.
    *   If the user's query is a simple greeting like "hello" or "hi", respond with a friendly greeting like "Hello! How can I help you with this event?" and nothing else.
    *   If the user's query is a simple thanks like "thank you" or "thanks", respond politely with "You're welcome!" or "Glad I could help!" and nothing else.
    *   For these simple cases, ONLY provide the 'answer' and leave all other fields in the output schema empty.

1.  **Analyze the User's Query**: If it's not a simple greeting, understand what the user is asking about the event.
    *   If the user asks "Who is the speaker?", "What is the time?", or "What is the topic?", you MUST ONLY provide a single, direct, conversational sentence in the 'answer' field and leave all other fields in the output schema empty.
        *   Example for "Who is the speaker?": "The speaker for this event is [Speaker's Name]."
        *   Example for "What is the time?": "The event is scheduled for [Event Time]."
        *   Example for "What is the topic?": "The topic of this event is [Event Topic]."
    *   If the query is more general (like "tell me about this event" or asks about skills/benefits), then and ONLY then should you provide a comprehensive response by filling out all the fields in the output schema.

2.  **Use the Right Information Source**:
    *   **If 'eventContext' is provided, use it as your primary source.** This is the event the user is currently looking at.
    *   **If 'eventContext' is NOT provided, or the user asks about a different event, use the 'getEventInformation' tool** to find the relevant details.

3.  **Generate a Response**:
    *   **For specific questions (speaker, time, topic):** Provide a direct, conversational, full-sentence answer in the 'answer' field. DO NOT fill out any other fields.
    *   **For general questions:** Generate a response that fills all the relevant fields in the output schema.
        *   **answer**: Provide a direct, conversational summary of the event.
        *   **benefits**: Analyze the event description and summarize the key benefits for an attendee.
        *   **skillsLearned**: From the description, extract a list of specific skills that will be taught.
        *   **prerequisites**: From the description, identify and summarize any prerequisites. If none are mentioned, explicitly state that it's open to all levels.

**User's Current Event Context (if available):**
{{#if eventContext}}
\`\`\`json
{{{eventContext}}}
\`\`\`
{{else}}
No specific event context. Use the tool if the user asks about an event.
{{/if}}

**User's Query:**
"{{{userQuery}}}"`,
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
