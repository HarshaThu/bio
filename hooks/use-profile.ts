import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile, Order } from "@/types/profile";

interface ProfileData {
  name: string;
  bio: string;
  phone: string;
  address: string;
}

export const useProfile = () => {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<ProfileData>(getInitialFormData(session));

  function getInitialFormData(session: any): ProfileData {
    return {
      name: session?.user?.name || "",
      bio: (session?.user as any)?.bio || "",
      phone: (session?.user as any)?.phone || "",
      address: (session?.user as any)?.address || "",
    };
  }

  // Reset form data when session changes or when needed
  const resetForm = () => {
    setFormData(getInitialFormData(session));
  };

  useEffect(() => {
    resetForm();
  }, [session]);

  const updateProfile = async (): Promise<Order[]> => {
    setLoading(true);
    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      
      // Update the session first and wait for it to complete
      await update({
        ...session,
        user: {
          ...session?.user,
          ...data.user,
          // Ensure required NextAuth fields are preserved
          id: session?.user?.id,
          role: session?.user?.role,
          email: session?.user?.email,
        },
      });

      // After session is updated, force a form data refresh
      const updatedFormData = {
        name: data.user.name || "",
        bio: data.user.bio || "",
        phone: data.user.phone || "",
        address: data.user.address || "",
      };
      setFormData(updatedFormData);

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      return data.orders;
    } catch (error) {
      console.error("[PROFILE_UPDATE]", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    updateProfile,
    resetForm,
  };
};
