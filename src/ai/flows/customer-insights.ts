'use server';
/**
 * @fileOverview A flow for generating insights from customer data.
 *
 * - generateCustomerInsights - Analyzes customer data to provide business insights.
 * - CustomerInsightsInput - The input type for the generateCustomerInsights function.
 * - CustomerInsightsOutput - The return type for the generateCustomerInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomerSchema = z.object({
  id: z.string().describe('Unique identifier for the customer.'),
  name: z.string().describe('The name of the customer.'),
  email: z.string().email().describe('The email address of the customer.'),
  totalSpent: z.number().describe('The total amount of money spent by the customer.'),
  lastPurchaseDate: z.string().describe('The date of the last purchase in ISO format.'),
});

const CustomerInsightsInputSchema = z.object({
  customers: z.array(CustomerSchema).describe('A list of customer data.'),
});
export type CustomerInsightsInput = z.infer<typeof CustomerInsightsInputSchema>;

const CustomerInsightsOutputSchema = z.object({
  topSpendingCustomers: z.array(z.object({
    customerId: z.string(),
    name: z.string(),
    totalSpent: z.number(),
  })).describe('A list of the top 3-5 spending customers.'),
  potentialChurnCustomers: z.array(z.object({
    customerId: z.string(),
    name: z.string(),
    lastPurchaseDate: z.string(),
  })).describe('A list of customers who have not made a purchase recently and might be at risk of churning.'),
  marketingSuggestions: z.array(z.string()).describe('Actionable marketing suggestions based on the customer data, such as promotions for specific segments.'),
});
export type CustomerInsightsOutput = z.infer<typeof CustomerInsightsOutputSchema>;

export async function generateCustomerInsights(
  input: CustomerInsightsInput
): Promise<CustomerInsightsOutput> {
  return customerInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customerInsightsPrompt',
  input: { schema: z.object({ customersJson: z.string() }) },
  output: { schema: CustomerInsightsOutputSchema },
  prompt: `You are a business intelligence analyst for a retail company. Analyze the following customer data and provide actionable insights.

Customer Data (JSON):
{{{customersJson}}}

Based on the data, identify:
1.  The top 3-5 spending customers.
2.  Customers who may be at risk of churning (e.g., haven't purchased in a while).
3.  Provide a few actionable marketing suggestions to re-engage customers or boost sales.
`,
});

const customerInsightsFlow = ai.defineFlow(
  {
    name: 'customerInsightsFlow',
    inputSchema: CustomerInsightsInputSchema,
    outputSchema: CustomerInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt({
      customersJson: JSON.stringify(input.customers),
    });
    return output!;
  }
);
