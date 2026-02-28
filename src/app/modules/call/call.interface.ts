import { Types } from "mongoose";
import { CALL_STATUS } from "./call.utils";

export interface ICallSession {
  channelName: string;
  caller: Types.ObjectId;
  receiver: Types.ObjectId;
  status: CALL_STATUS;
  startedAt?: Date;
  endedAt?: Date;
}