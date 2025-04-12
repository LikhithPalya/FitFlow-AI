'use server';
/**
 * @fileOverview Adapts a workout plan based on user feedback.
 *
 * - adaptWorkoutPlan - A function that adapts the workout plan.
 * - AdaptWorkoutPlanInput - The input type for the adaptWorkoutPlan function.
 * - AdaptWorkoutPlanOutput - The return type for the adaptWorkoutPlan function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AdaptWorkoutPlanInputSchema = z.object({
  workoutPlan: z.string().describe('The current workout plan in JSON format.'),
  feedback: z.string().describe('User feedback on the workout plan (e.g., difficulty, enjoyment).'),
  userProfile: z.string().optional().describe('The user profile data including age, weight and goals in JSON format.'),
});
export type AdaptWorkoutPlanInput = z.infer<typeof AdaptWorkoutPlanInputSchema>;

const AdaptWorkoutPlanOutputSchema = z.object({
  adaptedWorkoutPlan: z.string().describe('The adapted workout plan in JSON format.'),
  explanation: z.string().describe('Explanation of why the workout plan was adapted.'),
});
export type AdaptWorkoutPlanOutput = z.infer<typeof AdaptWorkoutPlanOutputSchema>;

export async function adaptWorkoutPlan(input: AdaptWorkoutPlanInput): Promise<AdaptWorkoutPlanOutput> {
  return adaptWorkoutPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptWorkoutPlanPrompt',
  input: {
    schema: z.object({
      workoutPlan: z.string().describe('The current workout plan in JSON format.'),
      feedback: z.string().describe('User feedback on the workout plan (e.g., difficulty, enjoyment).'),
      userProfile: z.string().optional().describe('The user profile data including age, weight and goals in JSON format.'),
    }),
  },
  output: {
    schema: z.object({
      adaptedWorkoutPlan: z.string().describe('The adapted workout plan in JSON format.'),
      explanation: z.string().describe('Explanation of why the workout plan was adapted.'),
    }),
  },
  prompt: `You are a personal fitness trainer.  A user has provided feedback on their workout plan.  Adapt the workout plan based on their feedback. Explain the reason behind changes.

Workout Plan:
{{workoutPlan}}

User Feedback:
{{feedback}}

User Profile:
{{userProfile}}

//test

Ensure the adapted workout plan is safe and effective for the user, do not increase the difficulty too fast.
Output the adapted workout plan in JSON format, and provide a short explanation of the changes you made.
`,
});

const adaptWorkoutPlanFlow = ai.defineFlow<
  typeof AdaptWorkoutPlanInputSchema,
  typeof AdaptWorkoutPlanOutputSchema
>(
  {
    name: 'adaptWorkoutPlanFlow',
    inputSchema: AdaptWorkoutPlanInputSchema,
    outputSchema: AdaptWorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
