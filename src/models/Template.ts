import mongoose, { Document, Schema } from 'mongoose'

export interface ITemplate extends Document {
  name: string
  type: 'email' | 'sms' | 'report' | 'certificate' | 'letter'
  category: 'attendance' | 'behavior' | 'grades' | 'announcement' | 'reminder' | 'general'
  subject: string
  content: string
  variables: string[] // list of available variables like {{studentName}}, {{className}}
  teacher: mongoose.Types.ObjectId
  isDefault: boolean
  isPublic: boolean
  usage: {
    count: number
    lastUsed?: Date
  }
  createdAt: Date
  updatedAt: Date
}

const TemplateSchema = new Schema<ITemplate>(
  {
    name: {
      type: String,
      required: [true, 'Template name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['email', 'sms', 'report', 'certificate', 'letter'],
      required: true,
    },
    category: {
      type: String,
      enum: ['attendance', 'behavior', 'grades', 'announcement', 'reminder', 'general'],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    variables: [String],
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    usage: {
      count: {
        type: Number,
        default: 0,
      },
      lastUsed: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
)

// Index for efficient querying
TemplateSchema.index({ teacher: 1, type: 1, category: 1 })
TemplateSchema.index({ isPublic: 1, type: 1 })

export default mongoose.models.Template ||
  mongoose.model<ITemplate>('Template', TemplateSchema)
