"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserProfile } from "@/types/profile";

interface ProfileViewProps {
  onEdit: () => void;
}

export function ProfileView({ onEdit }: ProfileViewProps) {
  const { data: session } = useSession();
  // Properly type the session user to include our custom fields
  const user = session?.user as unknown as {
    name: string | null;
    email: string;
    bio: string | null;
    phone: string | null;
    address: string | null;
    avatarUrl: string | null;
  };

  const profile: UserProfile = {
    name: user?.name || null,
    email: user?.email || "",
    bio: user?.bio || null,
    phone: user?.phone || null,
    address: user?.address || null,
    avatarUrl: user?.avatarUrl || null,
  };

  // Debug session updates
  useEffect(() => {
    if (user) {
      console.log('Profile data:', {
        name: user.name,
        email: user.email,
        bio: user.bio,
        phone: user.phone,
        address: user.address
      });
    }
  }, [user]);

  const ProfileSection = ({ title, content }: { title: string; content: string | null }) => (
    <div>
      <h3 className="font-medium text-sm text-gray-500">{title}</h3>
      <p className="mt-1">{content || "Not provided"}</p>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Profile Information</CardTitle>
        <Button onClick={onEdit}>Edit Profile</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ProfileSection title="Name" content={profile.name} />
              <Separator className="my-4" />
              <ProfileSection title="Email" content={profile.email} />
            </div>
            <div className="space-y-4">
              <ProfileSection title="Phone" content={profile.phone} />
              <Separator className="my-4" />
              <ProfileSection title="Address" content={profile.address} />
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-2">Bio</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {profile.bio || "No bio provided"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
