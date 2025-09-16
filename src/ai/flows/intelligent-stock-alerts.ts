'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating intelligent stock alerts based on historical sales data and seasonal trends.
 *
 * - intelligentStockAlerts - A function that takes current stock levels and historical sales data to predict low stock situations.
 * - IntelligentStockAlertsInput - The input type for the intelligentStockAlerts function.
 * - IntelligentStockAlertsOutput - The return type for the intelligentStockAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentStockAlertsInputSchema = z.object({
  currentStockLevels: z
    .record(z.number())
    .describe('A map of product IDs to their current stock levels.'),
  historicalSalesData: z
    .record(z.array(z.object({
      date: z.string().describe('The date of the sale in ISO format.'),
      quantitySold: z.number().describe('The quantity of the product sold.'),
    })))
    .describe(
      'A map of product IDs to an array of historical sales data, including date and quantity sold.'
    ),
  seasonalTrends: z
    .record(z.number())
    .optional()
    .describe('A map of product IDs to a seasonal trend multiplier.'),
});

export type IntelligentStockAlertsInput = z.infer<typeof IntelligentStockAlertsInputSchema>;

const IntelligentStockAlertsOutputSchema = z.object({
  alerts: z.array(
    z.object({
      productId: z.string().describe('The ID of the product that needs reordering.'),
      reason: z.string().describe('The reason for the alert.'),
    })
  ).describe('An array of alerts for products that are predicted to run low on stock.'),
});

export type IntelligentStockAlertsOutput = z.infer<typeof IntelligentStockAlertsOutputSchema>;

export async function intelligentStockAlerts(
  input: IntelligentStockAlertsInput
): Promise<IntelligentStockAlertsOutput> {
  return intelligentStockAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentStockAlertsPrompt',
  input: {
    schema: z.object({
      currentStockLevels: z.string(),
      historicalSalesData: z.string(),
      seasonalTrends: z.string().optional(),
    }),
  },
  output: {schema: IntelligentStockAlertsOutputSchema},
  prompt: `You are an AI assistant that analyzes stock levels, historical sales data, and seasonal trends to generate intelligent stock alerts.

Analyze the following data to predict which products are likely to run low on stock. Provide the product ID and a brief reason for each alert.

Current Stock Levels: {{{currentStockLevels}}}
Historical Sales Data: {{{historicalSalesData}}}
Seasonal Trends: {{{seasonalTrends}}}

Generate alerts only for products where stock is likely to run low soon, taking into account historical sales and any seasonal trends.
`,
});

const intelligentStockAlertsFlow = ai.defineFlow(
  {
    name: 'intelligentStockAlertsFlow',
    inputSchema: IntelligentStockAlertsInputSchema,
    outputSchema: IntelligentStockAlertsOutputSchema,
  },
  async input => {
    const {output} = await prompt({
        currentStockLevels: JSON.stringify(input.currentStockLevels),
        historicalSalesData: JSON.stringify(input.historicalSalesData),
        seasonalTrends: JSON.stringify(input.seasonalTrends),
    });
    return output!;
  }
);
