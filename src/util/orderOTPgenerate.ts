import { CounterModel } from "../app/modules/order/counter.model";

const getNextOrderCode = async () => {
  const counter = await CounterModel.findOneAndUpdate(
    { name: "order" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `ORD-${String(counter.seq).padStart(6, "0")}`;
};


const getNextTransactionCode = async () => {
  const counter = await CounterModel.findOneAndUpdate(
    { name: "transaction" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `TXN-${String(counter.seq).padStart(6, "0")}`;
};

export { getNextOrderCode, getNextTransactionCode };