import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '@/modules/users/schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';

export type PostDocument = Post & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Post {
  @Prop({ 
    type: String, 
    default: uuidv4,
  })
  _id: string;

  @Prop({ required: true, index: 'text' })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ 
    type: String,
    ref: User.name,
    required: true,
    index: true 
  })
  user: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Add indexes
PostSchema.index({ title: 'text' });
PostSchema.index({ user: 1 }); 