import mongoose, { Document, Schema } from 'mongoose'

export interface INotification extends Document {
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error' | 'reminder'
  recipient: mongoose.Types.ObjectId // teacher ID
  relatedEntity?: {
    type: 'student' | 'class' | 'assignment' | 'attendance'
    id: mongoose.Types.ObjectId
  }
  isRead: boolean
  readAt?: Date
  priority: 'low' | 'medium' | 'high'
  scheduledFor?: Date // for scheduled notifications
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['info', 'warning', 'success', 'error', 'reminder'],
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    relatedEntity: {
      type: {
        type: String,
        enum: ['student', 'class', 'assignment', 'attendance'],
      },
      id: {
        type: Schema.Types.ObjectId,
      },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    scheduledFor: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Index for efficient querying
NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 })

export default mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', NotificationSchema)
