import { Types } from 'mongoose';

export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: "User", required: true})
  userId: string;
} 