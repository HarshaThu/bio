import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Order as OrderType } from "@/types/profile";

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    price: number;
  };
}

interface DBOrder {
  _id: any;
  userId: string;
  total: number;
  status: string;
  createdAt: Date;
  shortId?: string;
  items: OrderItem[];
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Get user
    const user = await db.collection('users').findOne({ email: session.user.email });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get user's orders
    console.log("Fetching orders for user:", user.email);
    const orders = await db.collection('orders')
      .find({
        userId: user._id.toString()
      })
      .sort({ createdAt: -1 })
      .toArray() as DBOrder[];

    // Log raw orders data
    console.log("Raw orders data:", JSON.stringify(orders, null, 2));

    // Map orders to include correct id and shortId fields
    const mappedOrders: OrderType[] = orders.map((order): OrderType => {
      console.log("Processing order:", order);
      return {
        id: order._id.toString(),
        shortId: order.shortId || order._id.toString().slice(-8),
        total: order.total,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map(item => ({
          product: item.product ? {
            name: item.product.name,
            price: item.product.price
          } : {
            name: 'Product Not Found',
            price: item.price
          },
          quantity: item.quantity,
          price: item.price
        }))
      };
    });

    return NextResponse.json({
      orders: mappedOrders
    });

  } catch (error) {
    console.error("[PROFILE_ORDERS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
