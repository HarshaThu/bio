'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/CartContext"
import { Minus, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-yellow-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-green-800 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Browse our products and add some items to your cart.</p>
            <Link href="/products">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-yellow-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-green-800 mb-8">Shopping Cart</h1>
        
        <div className="space-y-6">
          {cart.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex gap-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold text-green-800">
                      {item.name}
                    </h3>
                    <p className="text-lg font-semibold text-green-700">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center mt-4 space-x-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="space-y-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={clearCart}
              className="flex-1"
            >
              Clear Cart
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => alert('Checkout functionality coming soon!')}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
