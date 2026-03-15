import { z } from "zod";

const sendMessage = z.object({
  body: z
    .object({
      deliveryId: z.string().min(1, "Delivery ID is required"),
      receiverId: z.string().min(1, "Receiver ID is required"),
      text: z
        .string()
        .trim()
        .max(2000, "Message cannot exceed 2000 characters")
        .optional()
        .transform((value) => value?.trim() || ""),
      attachments: z.array(z.string().min(1)).optional().default([]),
    })
    .superRefine((data, ctx) => {
      const hasText = Boolean(data.text?.trim());
      const hasAttachments = Boolean(data.attachments?.length);

      if (!hasText && !hasAttachments) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Either text or at least one attachment is required",
          path: ["text"],
        });
      }
    }),
});

const getMessages = z.object({
  params: z.object({
    deliveryId: z.string().min(1, "Delivery ID is required"),
  }),
});

const markAsRead = z.object({
  params: z.object({
    deliveryId: z.string().min(1, "Delivery ID is required"),
  }),
});

export const MessageValidation = {
  sendMessage,
  getMessages,
  markAsRead,
};