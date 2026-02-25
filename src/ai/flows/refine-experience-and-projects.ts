'use server';
/**
 * @fileOverview An AI agent that refines raw work history and project descriptions
 * to highlight transferable skills and achievements for a professional portfolio.
 *
 * - refineExperienceAndProjects - A function that handles the experience and project refinement process.
 * - RefineExperienceAndProjectsInput - The input type for the refineExperienceAndProjects function.
 * - RefineExperienceAndProjectsOutput - The return type for the refineExperienceAndProjects function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schemas
const WorkExperienceInputSchema = z.object({
  jobTitle: z.string().describe('The job title or role.'),
  organization: z.string().describe('The organization or company.'),
  datesOfInvolvement: z.string().describe('Dates of involvement (e.g., "Jan 2020 - Dec 2022").'),
  keyResponsibilities: z.string().describe('Raw, unpolished description of key responsibilities.'),
  keyAchievementOrOutcome: z.string().describe('Raw, unpolished description of a key achievement or outcome.'),
});

const ProjectInputSchema = z.object({
  projectTitle: z.string().describe('The title of the project.'),
  projectPurposeProblemSolved: z.string().describe('Raw, unpolished description of the project purpose or problem solved.'),
  toolsOrTechnologiesUsed: z.string().describe('Tools or technologies used in the project.'),
  skillsDemonstrated: z.string().describe('Skills demonstrated in the project.'),
  projectLink: z.string().url().optional().describe('Link to the project (GitHub, live site, demo, etc.).'),
});

const RefineExperienceAndProjectsInputSchema = z.object({
  workExperiences: z.array(WorkExperienceInputSchema).describe('A list of raw work experiences to be refined.'),
  projects: z.array(ProjectInputSchema).describe('A list of raw project descriptions to be refined.'),
});
export type RefineExperienceAndProjectsInput = z.infer<typeof RefineExperienceAndProjectsInputSchema>;

// Output Schemas
const RefinedWorkExperienceOutputSchema = z.object({
  jobTitle: z.string().describe('The job title or role, unchanged from input.'),
  organization: z.string().describe('The organization or company, unchanged from input.'),
  datesOfInvolvement: z.string().describe('Dates of involvement (e.g., "Jan 2020 - Dec 2022"), unchanged from input.'),
  refinedResponsibilities: z.string().describe('Enhanced description of key responsibilities, highlighting transferable skills and impact, using concise paragraphs or bullet points.'),
  refinedAchievementOrOutcome: z.string().describe('Enhanced description of a key achievement or outcome, highlighting measurable results and impact, using concise paragraphs or bullet points.'),
});

const RefinedProjectOutputSchema = z.object({
  projectTitle: z.string().describe('The title of the project, unchanged from input.'),
  refinedProjectDescription: z.string().describe('Polished project description, highlighting problem-solving, skills, and real-world application, using concise paragraphs or bullet points.'),
  toolsOrTechnologiesUsed: z.string().describe('Tools or technologies used in the project, unchanged from input.'),
  skillsDemonstrated: z.string().describe('Skills demonstrated in the project, unchanged from input.'),
  projectLink: z.string().url().optional().describe('Link to the project (GitHub, live site, demo, etc.), unchanged from input.'),
});

const RefineExperienceAndProjectsOutputSchema = z.object({
  refinedWorkExperiences: z.array(RefinedWorkExperienceOutputSchema).describe('A list of refined work experiences.'),
  refinedProjects: z.array(RefinedProjectOutputSchema).describe('A list of refined project descriptions.'),
});
export type RefineExperienceAndProjectsOutput = z.infer<typeof RefineExperienceAndProjectsOutputSchema>;

export async function refineExperienceAndProjects(input: RefineExperienceAndProjectsInput): Promise<RefineExperienceAndProjectsOutput> {
  return refineExperienceAndProjectsFlow(input);
}

const refineExperienceAndProjectsPrompt = ai.definePrompt({
  name: 'refineExperienceAndProjectsPrompt',
  input: { schema: RefineExperienceAndProjectsInputSchema },
  output: { schema: RefineExperienceAndProjectsOutputSchema },
  prompt: `You are a professional career branding expert, web content writer, and UX designer.
Your task is to enhance and rephrase raw work history and project descriptions to highlight transferable skills, key achievements, and professional impact.
The tone should be professional, confident, and clear. Use concise paragraphs and bullet points where appropriate.

For each work experience, you must:
1.  **Keep** 'jobTitle', 'organization', and 'datesOfInvolvement' exactly as they are.
2.  **Rewrite** 'keyResponsibilities' into 'refinedResponsibilities', focusing on skills and impact.
3.  **Rewrite** 'keyAchievementOrOutcome' into 'refinedAchievementOrOutcome', focusing on measurable results and impact.

For each project, you must:
1.  **Keep** 'projectTitle', 'toolsOrTechnologiesUsed', 'skillsDemonstrated', and 'projectLink' exactly as they are.
2.  **Rewrite** 'projectPurposeProblemSolved' into 'refinedProjectDescription', emphasizing problem-solving, skills, and real-world application.

Here is the raw data:

### Work Experiences:
{{#each workExperiences}}
Job Title: {{jobTitle}}
Organization: {{organization}}
Dates of Involvement: {{datesOfInvolvement}}
Raw Responsibilities: {{{keyResponsibilities}}}
Raw Achievement: {{{keyAchievementOrOutcome}}}
---
{{/each}}

### Projects:
{{#each projects}}
Project Title: {{projectTitle}}
Raw Purpose/Problem: {{{projectPurposeProblemSolved}}}
Tools/Technologies: {{toolsOrTechnologiesUsed}}
Skills Demonstrated: {{skillsDemonstrated}}
{{#if projectLink}}Project Link: {{projectLink}}{{/if}}
---
{{/each}}

Please output the refined content as a JSON object, strictly following the defined output schema.`
});

const refineExperienceAndProjectsFlow = ai.defineFlow(
  {
    name: 'refineExperienceAndProjectsFlow',
    inputSchema: RefineExperienceAndProjectsInputSchema,
    outputSchema: RefineExperienceAndProjectsOutputSchema,
  },
  async (input) => {
    const { output } = await refineExperienceAndProjectsPrompt(input);
    return output!;
  }
);
