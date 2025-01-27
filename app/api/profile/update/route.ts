import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, bio, phone, address } = body;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        bio,
        phone,
        address,
      },
      include: {
        orders: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    return NextResponse.json({
      user: {
        name: updatedUser.name,
        bio: updatedUser.bio,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        avatarUrl: updatedUser.avatarUrl,
      },
      orders: updatedUser.orders
    });
  } catch (error) {
    console.error("[PROFILE_UPDATE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
