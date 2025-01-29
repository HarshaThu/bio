"use client";

import { Order } from "@/types/profile";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">
              Order #{order.shortId || order.id.toString().slice(-8)}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
              {order.status}
            </Badge>
            <p className="font-semibold text-lg">${order.total.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Quantity badge */}
                  <span className="flex items-center justify-center bg-green-100 text-green-800 text-sm font-medium h-6 w-6 rounded">
                    {item.quantity}
                  </span>
                  {/* Product name */}
                  <span className="text-gray-900">
                    {item.product?.name || 'Product Not Found'}
                  </span>
                </div>
                {/* Price */}
                <span className="text-gray-900 font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Order total */}
          <Separator className="my-4" />
          <div className="flex justify-between items-center pt-2">
            <span className="font-medium text-gray-900">Total</span>
            <span className="text-lg font-semibold text-green-700">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
