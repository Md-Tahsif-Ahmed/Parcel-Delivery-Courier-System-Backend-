export type IVehiclePricing = {
  vehicleType: string;

  baseFee: number;
  perMileRate: number;

  minFare: number;
  maxFare?: number | null;

  weight: {
    includedLbs: number;
    perExtraLbsRate: number;
    maxWeightLbs?: number | null;
  };

  rounding: {
    mode: "NEAREST" | "UP" | "DOWN";
    step: number;
  };

  range: {
    lowMultiplier: number;
    highMultiplier: number;
  };

  isActive: boolean;
};

export type IPricingConfig = {
  currency: string;
  version: number;
  vehicles: IVehiclePricing[];
  updatedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type IEstimateInput = {
  vehicleType: string;
  pickup: { lat: number; lng: number };
  dropoff: { lat: number; lng: number };
  weightLbs: number;
};

export type IEstimateResult = {
  currency: string;
  version: number;
  distanceMiles: number;
  breakdown: {
    baseFee: number;
    distanceFare: number;
    weightFare: number;
    raw: number;
  };
  estimatedFare: number;
  suggestedRange: { low: number; high: number };
};