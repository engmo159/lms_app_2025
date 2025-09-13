import mongoose, { Document, Schema } from 'mongoose'

export interface IBehavior extends Document {
  student: mongoose.Types.ObjectId
  class: mongoose.Types.ObjectId
  teacher: mongoose.Types.ObjectId
  type: 'positive' | 'negative'
  category: string // e.g., 'participation', 'disruption', 'helping_others'
  title: string
  description: string
  points: number // positive or negative points
  date: Date
  createdAt: Date
  updatedAt: Date
}

const BehaviorSchema = new Schema<IBehavior>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    type: {
      type: String,
      enum: ['positive', 'negative'],
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    points: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Behavior ||
  mongoose.model<IBehavior>('Behavior', BehaviorSchema)
