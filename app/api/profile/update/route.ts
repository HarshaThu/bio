import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, bio, phone, address } = body;

    const client = await clientPromise;
    const db = client.db();

    // Update user
    await db.collection('users').updateOne(
      { email: session.user.email },
      {
        $set: {
          name,
          bio,
          phone,
          address,
          updatedAt: new Date()
        }
      }
    );

    // Get updated user with orders
    const updatedUser = await db.collection('users').findOne(
      { email: session.user.email }
    );

    if (!updatedUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get user's orders with items and products
    const orders = await db.collection('orders')
      .aggregate([
        {
          $match: {
            userId: updatedUser._id.toString()
          }
        },
        {
          $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "_id",
            as: "products"
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ]).toArray();

    return NextResponse.json({
      user: {
        name: updatedUser.name,
        bio: updatedUser.bio,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        avatarUrl: updatedUser.avatarUrl || '/default-avatar.png',
        credit: updatedUser.credit || 0,
      },
      orders: orders
    });
  } catch (error) {
    console.error("[PROFILE_UPDATE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
