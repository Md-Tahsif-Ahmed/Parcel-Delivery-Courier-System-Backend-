import { Schema, model } from "mongoose";

const counterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

export const CounterModel = model("Counter", counterSchema);
