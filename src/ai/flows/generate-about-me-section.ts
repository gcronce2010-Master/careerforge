'use server';
/**
 * @fileOverview A Genkit flow for generating a professional 'About Me' section for a web portfolio.
 *
 * - generateAboutMeSection - A function that handles the generation of the 'About Me' section.
 * - GenerateAboutMeSectionInput - The input type for the generateAboutMeSection function.
 * - GenerateAboutMeSectionOutput - The return type for the generateAboutMeSection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAboutMeSectionInputSchema = z.object({
  currentRoleOrFocus: z.string().describe('The user\'s current role or professional focus.'),
  fieldsOfInterest: z
    .string()
    .describe('A comma-separated list of the user\'s fields of interest (e.g., AI, cyber security).'),
  shortTermGoal: z.string().describe('The user\'s short-term professional goal.'),
  longTermGoal: z.string().describe('The user\'s long-term career goal.'),
  overallStyle: z
    .string()
    .describe('The desired overall style for the portfolio content (e.g., bold & creative / modern & tech).'),
  layoutType: z
    .string()
    .describe('The intended layout type of the portfolio (e.g., single-page scroll / card-based).'),
  targetAudience: z
    .string()
    .describe('The primary audience for the portfolio (e.g., employers / clients / graduate programs).'),
});
export type GenerateAboutMeSectionInput = z.infer<typeof GenerateAboutMeSectionInputSchema>;

const GenerateAboutMeSectionOutputSchema = z.object({
  aboutMeContent: z.string().describe('The professionally generated \'About Me\' section.'),
});
export type GenerateAboutMeSectionOutput = z.infer<typeof GenerateAboutMeSectionOutputSchema>;

export async function generateAboutMeSection(
  input: GenerateAboutMeSectionInput
): Promise<GenerateAboutMeSectionOutput> {
  return generateAboutMeSectionFlow(input);
}

const generateAboutMePrompt = ai.definePrompt({
  name: 'generateAboutMePrompt',
  input: {schema: GenerateAboutMeSectionInputSchema},
  output: {schema: GenerateAboutMeSectionOutputSchema},
  prompt: `You are a professional career branding expert, web content writer, and UX designer. Your task is to create a complete, polished "About Me" section for a professional online web portfolio, based on the user information provided below.

The tone should be professional, confident, and clear. Use concise paragraphs and bullet points where appropriate. This content will be published on a personal website.

Consider the following visual design and branding elements for the overall style and tone:
Overall Style: {{{overallStyle}}}
Layout Type: {{{layoutType}}}
Target Audience: {{{targetAudience}}}

Now, create a compelling "About Me" section that introduces who the user is, what they are working toward, and what motivates them professionally.

User Information:
Current Role or Focus: {{{currentRoleOrFocus}}}
Fields of Interest: {{{fieldsOfInterest}}}
Short-term Professional Goal: {{{shortTermGoal}}}
Long-term Career Goal: {{{longTermGoal}}}`,
});

const generateAboutMeSectionFlow = ai.defineFlow(
  {
    name: 'generateAboutMeSectionFlow',
    inputSchema: GenerateAboutMeSectionInputSchema,
    outputSchema: GenerateAboutMeSectionOutputSchema,
  },
  async input => {
    const {output} = await generateAboutMePrompt(input);
    return output!;
  }
);
