import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import clientPromise from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    const client = await clientPromise;
    const db = client.db();

    // Check if user exists
    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user with default role and credit
    const initialCredit = Number(200); // Ensure it's a number type
    console.log('Setting initial credit:', initialCredit, typeof initialCredit);

    const newUser = {
      email,
      password: hashedPassword,
      name,
      role: 'user',
      credit: initialCredit,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Creating new user with credit:', newUser.credit, typeof newUser.credit);
    const result = await db.collection('users').insertOne(newUser);

    // Explicitly verify and update credit if needed
    const updatedUser = await db.collection('users').findOne(
      { _id: result.insertedId },
      { projection: { password: 0 } }
    );

    if (!updatedUser) {
      throw new Error('Error creating user - user not found after creation');
    }

    // Double-check credit and update if needed
    if (typeof updatedUser.credit !== 'number') {
      await db.collection('users').updateOne(
        { _id: result.insertedId },
        { $set: { credit: 200 } }
      );
    }

    // Get final state after potential update
    const finalUser = await db.collection('users').findOne(
      { _id: result.insertedId },
      { projection: { password: 0 } }
    );

    if (!finalUser) {
      throw new Error('Error retrieving final user state');
    }

    console.log('Final user data after registration:', {
      id: finalUser._id.toString(),
      email: finalUser.email,
      credit: finalUser.credit,
      creditType: typeof finalUser.credit
    });

    return NextResponse.json(
      {
        user: {
          id: finalUser._id.toString(),
          email: finalUser.email,
          name: finalUser.name,
          role: finalUser.role,
          credit: finalUser.credit,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    );
  }
}
