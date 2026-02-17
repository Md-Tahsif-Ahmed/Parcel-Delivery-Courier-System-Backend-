import { z } from 'zod';
import { EventCategory, SectionColor } from './event.interface';
import { TeamValidation } from '../team/team.validation';

const ticketCategorySchema = z.object({
  ticketName: z.string().min(1, 'Ticket name is required'),
  sectionColor: z.enum(Object.values(SectionColor) as [string, ...string[]]),
  pricePerTicket: z.number().min(0, 'Price must be non-negative'),
  totalQuantity: z.number().min(0, 'Quantity must be non-negative'),
  notes: z.string().optional(),
});

const createEventZodSchema = z.object({
  body: z.object({
    thumbnail: z.string().optional(),
    seatingChart: z.string().optional(),
    title: z.string({ required_error: 'Title is required' }),
    artistId: z.string().optional(),
    teamA: z.string().optional(),
    teamB: z.string().optional(),
    category: z.enum(Object.values(EventCategory) as [string, ...string[]]),
    eventDate: z.coerce.date({ required_error: 'Event date is required' }),
    city: z.string({ required_error: 'City is required' }),
    venueName: z.string({ required_error: 'Venue name is required' }),
    fullAddress: z.string({ required_error: 'Full address is required' }),
    description: z.string().optional(),
    ticketCategories: z.array(ticketCategorySchema).optional(),
  }).refine((data) => {
    if (data.category === EventCategory.CONCERT) {
      return data.artistId && !data.teamA && !data.teamB; // Artist is required, no team for concerts
    }
    if (data.category === EventCategory.SPORTS) {
      return data.teamA && data.teamB && !data.artistId; // Team A and Team B are required, no artist for sports
    }
    return true; // For other categories, no specific condition
  }, {
    message: 'Either artistId or teamA and teamB are required based on the event category.',
    path: ['artistId', 'teamA', 'teamB'],
  }),
});

 

const updateEventZodSchema = z.object({
  body: z.object({
    thumbnail: z.string().optional(),
    seatingChart: z.string().optional(),
    title: z.string().min(1).optional(),
    artistId: z.string().optional(),
    teamA: z.string().optional(),
    teamB: z.string().optional(),
    category: z.enum(Object.values(EventCategory) as [string, ...string[]]).optional(),
    eventDate: z.coerce.date().optional(),
    city: z.string().optional(),
    venueName: z.string().optional(),
    fullAddress: z.string().optional(),
    description: z.string().optional(),
    ticketCategories: z.array(ticketCategorySchema).optional(),
  }).superRefine((data, ctx) => {
    if (data.category === EventCategory.SPORTS) {
      if (data.artistId) {
        ctx.addIssue({
          path: ['artistId'],
          message: 'Sports event cannot have artistId',
          code: z.ZodIssueCode.custom,
        });
      }
    }

    if (data.category === EventCategory.CONCERT) {
      if (data.teamA || data.teamB) {
        ctx.addIssue({
          path: ['teamA', 'teamB'],
          message: 'Concert event cannot have teams',
          code: z.ZodIssueCode.custom,
        });
      }
    }
  }),
});


export const EventValidation = { createEventZodSchema, updateEventZodSchema };