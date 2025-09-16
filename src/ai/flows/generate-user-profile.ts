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
  // Using a placeholder image service to avoid Imagen API billing requirements.
  const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(input.name)}/200`;
  return Promise.resolve({ photoDataUri: imageUrl });
}
