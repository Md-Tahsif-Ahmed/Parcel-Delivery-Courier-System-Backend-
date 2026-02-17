import { z } from 'zod';

export const ContactValidation = {
  sendContactMessage: z.object({
    body: z.object({
      name: z.string({ required_error: 'Name is required' }).min(1),
      subject: z.string({ required_error: 'Subject is required' }).min(1),
      message: z.string({ required_error: 'Message is required' }).min(1),
 
    }),
  }),
};