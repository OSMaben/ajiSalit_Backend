// command.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommandDocument = HydratedDocument<Command>;

@Schema()
export class Command {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: string;

  @Prop({ type: Types.ObjectId,ref: 'User', required: true }) 
  clientId: string;

  @Prop({ type: Object, required: true }) 
  answers: Record<string, any>;

  @Prop()
  qrCodeUrl: string; // URL pointing to the stored QR code image


  @Prop({ required: true, enum: ['pending', 'in-progress', 'ready', 'delivered'] })
  status: string;
  
  @Prop({ required: true })
  amount: number; 

  @Prop({ required: true })
  StartDate: Date;

  @Prop({ required: true })
  endDate: Date;

}

export const CommandSchema = SchemaFactory.createForClass(Command);
