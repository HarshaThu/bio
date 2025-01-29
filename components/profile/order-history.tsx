"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/profile";
import { OrderCard } from "./order-card";

interface OrderHistoryProps {
  orders: Order[];
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders yet</p>
            <p className="text-sm text-gray-400 mt-1">Your order history will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
