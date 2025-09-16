'use server';
/**
 * @fileOverview A flow for generating a user profile image.
 *
 * - generateUserProfile - A function that generates a user profile image.
 * - GenerateUserProfileInput - The input type for the generateUserProfile function.
 * - GenerateUserProfileOutput - The return type for the generateUserProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateUserProfileInputSchema = z.object({
  name: z.string().describe('The name of the user.'),
});
export type GenerateUserProfileInput = z.infer<typeof GenerateUserProfileInputSchema>;

const GenerateUserProfileOutputSchema = z.object({
  photoDataUri: z.string().describe('The generated profile photo as a data URI.'),
});
export type GenerateUserProfileOutput = z.infer<typeof GenerateUserProfileOutputSchema>;

export async function generateUserProfile(
  input: GenerateUserProfileInput
): Promise<GenerateUserProfileOutput> {
  return generateUserProfileFlow(input);
}

const generateUserProfileFlow = ai.defineFlow(
  {
    name: 'generateUserProfileFlow',
    inputSchema: GenerateUserProfileInputSchema,
    outputSchema: GenerateUserProfileOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `Generate a unique, abstract, and minimalist avatar representing the name '${input.name}'. The image should be suitable as a profile picture. Use a vibrant but professional color palette.`,
    });

    if (!media.url) {
        throw new Error('Image generation failed.');
    }

    return { photoDataUri: media.url };
  }
);
