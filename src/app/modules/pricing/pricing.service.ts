import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { PricingConfig } from "./pricing.model";
import {
  IEstimateInput,
  IEstimateResult,
} from "./pricing.interface";

// ================= CACHE =================
let cachedConfig: any = null;
let cachedAt = 0;
const CACHE_TTL_MS = 60 * 1000;

// ================= CONSTANT =================
const KM_TO_MILES = 0.621371;

// ================= LOAD CONFIG =================
const loadConfig = async () => {
  const now = Date.now();

  if (cachedConfig && now - cachedAt < CACHE_TTL_MS) {
    return cachedConfig;
  }

  const config = await PricingConfig.findOne().lean();

  if (!config) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Pricing config not set",
    );
  }

  cachedConfig = config;
  cachedAt = now;

  return config;
};

// ================= WEIGHT NORMALIZER =================
const getWeightConfigLbs = (weight: any) => {
  return {
    includedLbs: Number(weight?.includedLbs || 0),
    perExtraLbsRate: Number(weight?.perExtraLbsRate || 0),
    maxWeightLbs:
      weight?.maxWeightLbs !== undefined
        ? Number(weight.maxWeightLbs)
        : null,
  };
};

// ================= HAVERSINE (MILES) =================
export const haversineMiles = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371; // km base

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const km = 2 * R * Math.asin(Math.sqrt(a));

  return km * KM_TO_MILES; // convert → miles
};

// ================= ROUNDING =================
const roundFare = (
  value: number,
  mode: "NEAREST" | "UP" | "DOWN",
  step: number,
) => {
  const s = step || 1;
  const x = value / s;

  if (mode === "UP") return Math.ceil(x) * s;
  if (mode === "DOWN") return Math.floor(x) * s;

  return Math.round(x) * s;
};

// ================= ESTIMATE =================
export const calculateEstimateToDB = async (
  input: IEstimateInput,
): Promise<IEstimateResult> => {
  const config = await loadConfig();

  const vp = (config.vehicles || []).find(
    (v: any) =>
      v.vehicleType === input.vehicleType && v.isActive,
  );

  if (!vp) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Vehicle pricing not configured",
    );
  }

  // ===== WEIGHT =====
  const { includedLbs, perExtraLbsRate, maxWeightLbs } =
    getWeightConfigLbs(vp.weight);

  if (
    maxWeightLbs !== null &&
    input.weightLbs > maxWeightLbs
  ) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Weight exceeds max limit for this vehicle",
    );
  }

  // ===== DISTANCE =====
  const distanceMiles = haversineMiles(
    input.pickup.lat,
    input.pickup.lng,
    input.dropoff.lat,
    input.dropoff.lng,
  );

  // ===== FARE CALC =====
  const distanceFare =
    distanceMiles * Number(vp.perMileRate || 0);

  const extraLbs = Math.max(
    0,
    input.weightLbs - includedLbs,
  );

  const weightFare =
    extraLbs * Number(perExtraLbsRate || 0);

  const baseFee = Number(vp.baseFee || 0);

  let raw = baseFee + distanceFare + weightFare;

  // ===== MIN / MAX =====
  raw = Math.max(raw, Number(vp.minFare || 0));

  if (vp.maxFare != null) {
    raw = Math.min(raw, Number(vp.maxFare));
  }

  // ===== ROUND =====
  const final = roundFare(
    raw,
    vp.rounding?.mode || "NEAREST",
    Number(vp.rounding?.step || 1),
  );

  // ===== RANGE =====
  const low =
    final * Number(vp.range?.lowMultiplier || 0.85);

  const high =
    final * Number(vp.range?.highMultiplier || 1.2);

  // ===== RESPONSE =====
  return {
    currency: config.currency || "usd",
    version: config.version,
    distanceMiles: Number(distanceMiles.toFixed(2)),
    breakdown: {
      baseFee,
      distanceFare: Number(distanceFare.toFixed(2)),
      weightFare: Number(weightFare.toFixed(2)),
      raw: Number(raw.toFixed(2)),
    },
    estimatedFare: Number(final.toFixed(2)),
    suggestedRange: {
      low: Number(low.toFixed(2)),
      high: Number(high.toFixed(2)),
    },
  };
};

// ================= GET CONFIG =================
export const getPricingConfigToDB = async () => {
  const config = await PricingConfig.findOne().lean();
  return config;
};

// ================= UPSERT CONFIG =================
export const upsertPricingConfigToDB = async (
  userId: string,
  payload: any,
) => {
  const existing = await PricingConfig.findOne();

  const normalizeVehicle = (v: any) => ({
    ...v,
    weight: {
      includedLbs: Number(v.weight?.includedLbs || 0),
      perExtraLbsRate: Number(
        v.weight?.perExtraLbsRate || 0,
      ),
      maxWeightLbs:
        v.weight?.maxWeightLbs != null
          ? Number(v.weight.maxWeightLbs)
          : null,
    },
  });

  if (!existing) {
    const created = await PricingConfig.create({
      ...payload,
      vehicles: (payload.vehicles || []).map(
        normalizeVehicle,
      ),
      version: 1,
      updatedBy: userId,
    });

    cachedConfig = null;
    return created;
  }

  existing.currency =
    payload.currency ?? existing.currency;

  existing.vehicles = payload.vehicles
    ? payload.vehicles.map(normalizeVehicle)
    : existing.vehicles;

  existing.version = (existing.version || 1) + 1;
  existing.updatedBy = userId as any;

  await existing.save();

  cachedConfig = null; // invalidate cache

  return existing;
};