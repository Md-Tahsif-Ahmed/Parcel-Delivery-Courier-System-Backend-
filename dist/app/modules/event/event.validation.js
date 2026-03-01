"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventValidation = void 0;
const zod_1 = require("zod");
const event_interface_1 = require("./event.interface");
const ticketCategorySchema = zod_1.z.object({
    ticketName: zod_1.z.string().min(1, 'Ticket name is required'),
    sectionColor: zod_1.z.enum(Object.values(event_interface_1.SectionColor)),
    pricePerTicket: zod_1.z.number().min(0, 'Price must be non-negative'),
    totalQuantity: zod_1.z.number().min(0, 'Quantity must be non-negative'),
    notes: zod_1.z.string().optional(),
});
const createEventZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        thumbnail: zod_1.z.string().optional(),
        seatingChart: zod_1.z.string().optional(),
        title: zod_1.z.string({ required_error: 'Title is required' }),
        artistId: zod_1.z.string().optional(),
        teamA: zod_1.z.string().optional(),
        teamB: zod_1.z.string().optional(),
        category: zod_1.z.enum(Object.values(event_interface_1.EventCategory)),
        eventDate: zod_1.z.coerce.date({ required_error: 'Event date is required' }),
        city: zod_1.z.string({ required_error: 'City is required' }),
        venueName: zod_1.z.string({ required_error: 'Venue name is required' }),
        fullAddress: zod_1.z.string({ required_error: 'Full address is required' }),
        description: zod_1.z.string().optional(),
        ticketCategories: zod_1.z.array(ticketCategorySchema).optional(),
    }).refine((data) => {
        if (data.category === event_interface_1.EventCategory.CONCERT) {
            return data.artistId && !data.teamA && !data.teamB; // Artist is required, no team for concerts
        }
        if (data.category === event_interface_1.EventCategory.SPORTS) {
            return data.teamA && data.teamB && !data.artistId; // Team A and Team B are required, no artist for sports
        }
        return true; // For other categories, no specific condition
    }, {
        message: 'Either artistId or teamA and teamB are required based on the event category.',
        path: ['artistId', 'teamA', 'teamB'],
    }),
});
const updateEventZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        thumbnail: zod_1.z.string().optional(),
        seatingChart: zod_1.z.string().optional(),
        title: zod_1.z.string().min(1).optional(),
        artistId: zod_1.z.string().optional(),
        teamA: zod_1.z.string().optional(),
        teamB: zod_1.z.string().optional(),
        category: zod_1.z.enum(Object.values(event_interface_1.EventCategory)).optional(),
        eventDate: zod_1.z.coerce.date().optional(),
        city: zod_1.z.string().optional(),
        venueName: zod_1.z.string().optional(),
        fullAddress: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        ticketCategories: zod_1.z.array(ticketCategorySchema).optional(),
    }).superRefine((data, ctx) => {
        if (data.category === event_interface_1.EventCategory.SPORTS) {
            if (data.artistId) {
                ctx.addIssue({
                    path: ['artistId'],
                    message: 'Sports event cannot have artistId',
                    code: zod_1.z.ZodIssueCode.custom,
                });
            }
        }
        if (data.category === event_interface_1.EventCategory.CONCERT) {
            if (data.teamA || data.teamB) {
                ctx.addIssue({
                    path: ['teamA', 'teamB'],
                    message: 'Concert event cannot have teams',
                    code: zod_1.z.ZodIssueCode.custom,
                });
            }
        }
    }),
});
exports.EventValidation = { createEventZodSchema, updateEventZodSchema };
