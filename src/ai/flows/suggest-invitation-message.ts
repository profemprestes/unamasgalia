'use server';

/**
 * @fileOverview AI agent to suggest alternate invitation messages.
 *
 * - suggestInvitationMessage - A function that suggests alternative invitation messages.
 * - SuggestInvitationMessageInput - The input type for the suggestInvitationMessage function.
 * - SuggestInvitationMessageOutput - The return type for the suggestInvitationMessage function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestInvitationMessageInputSchema = z.object({
  originalMessage: z.string().describe('The original invitation message.'),
});

export type SuggestInvitationMessageInput = z.infer<typeof SuggestInvitationMessageInputSchema>;

const SuggestInvitationMessageOutputSchema = z.object({
  suggestedMessages: z.array(z.string()).describe('An array of suggested alternative invitation messages.'),
});

export type SuggestInvitationMessageOutput = z.infer<typeof SuggestInvitationMessageOutputSchema>;

export async function suggestInvitationMessage(input: SuggestInvitationMessageInput): Promise<SuggestInvitationMessageOutput> {
  return suggestInvitationMessageFlow(input);
}

const suggestInvitationMessagePrompt = ai.definePrompt({
  name: 'suggestInvitationMessagePrompt',
  input: {
    schema: z.object({
      originalMessage: z.string().describe('The original invitation message.'),
    }),
  },
  output: {
    schema: z.object({
      suggestedMessages: z.array(z.string()).describe('An array of suggested alternative invitation messages.'),
    }),
  },
  prompt: `You are an AI assistant helping to generate alternative invitation messages.  The user will provide an original message, and you should generate 3 alternative messages that are similar in tone and intent, but use different wording.

Original Message: {{{originalMessage}}}

Alternatives:
`,
});

const suggestInvitationMessageFlow = ai.defineFlow<
  typeof SuggestInvitationMessageInputSchema,
  typeof SuggestInvitationMessageOutputSchema
>({
  name: 'suggestInvitationMessageFlow',
  inputSchema: SuggestInvitationMessageInputSchema,
  outputSchema: SuggestInvitationMessageOutputSchema,
},
async input => {
  const {output} = await suggestInvitationMessagePrompt(input);
  return output!;
});
