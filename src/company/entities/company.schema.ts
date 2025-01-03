
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema()
export class Question {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true, enum: ['text', 'number', 'date', 'select'] })
  answerType: string;

  @Prop({ required: false, type: [String] })
  options?: string[];
}

@Schema()
export class Company {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['washing', 'tailor', 'other'] })
  type: string;

  @Prop({ required: true })
  address: string;
  

  @Prop({ required: true })
  Phone: number;
  

  @Prop({ type: [Question] })
  questions: Question[];

  @Prop({ required: true })
  createdAt: Date;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
