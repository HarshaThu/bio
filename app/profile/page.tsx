"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Order } from "@/types/profile";
import { ProfileForm } from "@/components/profile/profile-form";
import { ProfileView } from "@/components/profile/profile-view";
import { OrderHistory } from "@/components/profile/order-history";
import { useToast } from "@/components/ui/use-toast";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user) return;
      
      try {
        const response = await fetch("/api/profile/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load order history",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [session, toast]);

  const handleProfileUpdate = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    setIsEditing(false); // Exit edit mode after successful update
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      {isEditing ? (
        <ProfileForm 
          onUpdate={handleProfileUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <ProfileView onEdit={handleEditClick} />
      )}
      {isLoading ? (
        <div className="text-center text-gray-500">Loading order history...</div>
      ) : (
        <OrderHistory orders={orders} />
      )}
    </div>
  );
}
