import { z } from "zod";

export const PricingValidation = {
  estimate: z.object({
    body: z.object({
      vehicleType: z.string().min(1),
      pickup: z.object({ lat: z.number(), lng: z.number() }),
      dropoff: z.object({ lat: z.number(), lng: z.number() }),
      weightLbs: z.number().min(0),
    }),
  }),

  upsertConfig: z.object({
    body: z.object({
      currency: z.string().min(1).optional(),
      vehicles: z.array(
        z.object({
          vehicleType: z.string().min(1),
          baseFee: z.number().min(0),
          perMileRate: z.number().min(0),

          minFare: z.number().min(0),
          maxFare: z.number().min(0).nullable().optional(),

          weight: z.object({
            includedLbs: z.number().min(0),
            perExtraLbsRate: z.number().min(0),
            maxWeightLbs: z.number().min(0).nullable().optional(),
          }),

          rounding: z.object({
            mode: z.enum(["NEAREST", "UP", "DOWN"]),
            step: z.number().min(0.1),
          }),

          range: z.object({
            lowMultiplier: z.number().min(0.1),
            highMultiplier: z.number().min(0.1),
          }),

          isActive: z.boolean(),
        }),
      ),
    }),
  }),
};