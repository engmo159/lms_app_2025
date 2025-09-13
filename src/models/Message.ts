import mongoose, { Document, Schema } from 'mongoose'

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId // teacher ID
  recipient: mongoose.Types.ObjectId // parent/student ID
  recipientType: 'parent' | 'student' | 'teacher'
  subject: string
  content: string
  type: 'email' | 'sms' | 'notification' | 'announcement'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'draft' | 'sent' | 'delivered' | 'read' | 'failed'
  relatedEntity?: {
    type: 'student' | 'class' | 'assignment' | 'attendance' | 'behavior'
    id: mongoose.Types.ObjectId
  }
  attachments?: string[]
  scheduledFor?: Date
  sentAt?: Date
  readAt?: Date
  replyTo?: mongoose.Types.ObjectId
  isTemplate: boolean
  templateName?: string
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    recipientType: {
      type: String,
      enum: ['parent', 'student', 'teacher'],
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
    type: {
      type: String,
      enum: ['email', 'sms', 'notification', 'announcement'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'delivered', 'read', 'failed'],
      default: 'draft',
    },
    relatedEntity: {
      type: {
        type: String,
        enum: ['student', 'class', 'assignment', 'attendance', 'behavior'],
      },
      id: {
        type: Schema.Types.ObjectId,
      },
    },
    attachments: [String],
    scheduledFor: {
      type: Date,
    },
    sentAt: {
      type: Date,
    },
    readAt: {
      type: Date,
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    isTemplate: {
      type: Boolean,
      default: false,
    },
    templateName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Index for efficient querying
MessageSchema.index({ sender: 1, createdAt: -1 })
MessageSchema.index({ recipient: 1, status: 1, createdAt: -1 })

export default mongoose.models.Message ||
  mongoose.model<IMessage>('Message', MessageSchema)
