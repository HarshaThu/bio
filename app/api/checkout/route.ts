import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/db";
import { authOptions } from "../auth/[...nextauth]/route";

interface CartItem {
  id: string;
  quantity: number;
  price: number;
  name: string;
}

interface Product {
  _id: ObjectId;
  name: string;
  price: number;
}

interface OrderItem {
  productId: ObjectId;
  quantity: number;
  price: number;
  product: {
    name: string;
    price: number;
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.json();
    const { items, total } = data;

    const client = await clientPromise;
    const db = client.db();

    // Get user
    const user = await db.collection('users').findOne({ email: session.user.email });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if user has enough credit
    if (user.credit < total) {
      return new NextResponse("Insufficient credit", { status: 400 });
    }

    // Create order with generated ID
    const orderId = new ObjectId();
    
    // Get all product IDs from items
    const productIds = items.map((item: CartItem) => new ObjectId(item.id));
    
    // Fetch all products in one query
    const products = await db.collection('products')
      .find({ _id: { $in: productIds } })
      .toArray() as Product[];

    // Create a map of product data for quick lookup
    const productMap = products.reduce((acc: { [key: string]: Product }, product) => {
      acc[product._id.toString()] = product;
      return acc;
    }, {});

    // Create order items with product data
    const itemsWithProducts = items.map((item: CartItem) => {
      const product = productMap[item.id];
      return {
        productId: new ObjectId(item.id),
        quantity: item.quantity,
        price: item.price,
        product: {
          name: product?.name || 'Product Not Found',
          price: product?.price || item.price
        }
      };
    });

    const order = {
      _id: orderId,
      userId: user._id.toString(),
      items: itemsWithProducts,
      total,
      status: 'completed',
      createdAt: new Date(),
      shortId: orderId.toString().slice(-8)
    };

    // Update user credit and create order in a transaction
    const session_db = client.startSession();
    
    try {
      await session_db.withTransaction(async () => {
        // Deduct credit from user
        await db.collection('users').updateOne(
          { _id: user._id },
          { $inc: { credit: -total } }
        );

        // Create order
        await db.collection('orders').insertOne(order);
      });
    } finally {
      await session_db.endSession();
    }

    return NextResponse.json({ 
      success: true,
      order: order,
      remainingCredit: user.credit - total
    });

  } catch (error) {
    console.error("[CHECKOUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
