import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const isRead = searchParams.get('isRead');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    await dbConnect();

    let query: any = { recipient: session.user.id };
    if (isRead !== null) {
      query.isRead = isRead === 'true';
    }
    if (type) {
      query.type = type;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('relatedEntity.id');

    const totalCount = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      recipient: session.user.id, 
      isRead: false 
    });

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, 
      message, 
      type, 
      recipient, 
      relatedEntity, 
      priority, 
      scheduledFor 
    } = body;

    // Validate required fields
    if (!title || !message || !type || !recipient) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, message, type, recipient' 
      }, { status: 400 });
    }

    await dbConnect();

    const notification = new Notification({
      title,
      message,
      type,
      recipient,
      relatedEntity,
      priority: priority || 'medium',
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
    });

    await notification.save();

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { notificationIds, isRead } = body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json({ 
        error: 'notificationIds must be an array' 
      }, { status: 400 });
    }

    await dbConnect();

    const updateData: any = { isRead };
    if (isRead) {
      updateData.readAt = new Date();
    }

    const result = await Notification.updateMany(
      { 
        _id: { $in: notificationIds },
        recipient: session.user.id 
      },
      updateData
    );

    return NextResponse.json({ 
      message: `${result.modifiedCount} notifications updated`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
