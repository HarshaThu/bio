import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const useCheckout = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const processCheckout = async (items: any[], total: number) => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Checkout failed");
      }

      toast({
        title: "Success",
        description: "Order placed successfully!",
      });

      return { success: true, remainingCredit: data.remainingCredit };
    } catch (error: any) {
      console.error("[CHECKOUT]", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process checkout",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    processCheckout,
    loading,
    userCredit: (session?.user as any)?.credit || 0,
  };
};
