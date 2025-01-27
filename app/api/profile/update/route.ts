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
    const { name, bio } = body;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        bio,
      },
    });

    return NextResponse.json({
      user: {
        name: updatedUser.name,
        bio: updatedUser.bio,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl,
      },
    });
  } catch (error) {
    console.error("[PROFILE_UPDATE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
