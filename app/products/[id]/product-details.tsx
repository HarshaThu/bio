'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/CartContext"

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function ProductDetails({ product }: { product: Product }) {
  const { addToCart } = useCart()

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-yellow-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="overflow-hidden">
          <CardHeader className="p-0">
            <div className="relative h-96">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-4 right-4">
                <Badge 
                  variant="secondary" 
                  className={`
                    ${product.category === 'Pesticides' ? 'bg-sky-100 text-sky-700' : ''}
                    ${product.category === 'Fertilizers' ? 'bg-yellow-100 text-yellow-700' : ''}
                  `}
                >
                  {product.category}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-green-800">
                {product.name}
              </h1>
              <span className="text-2xl font-bold text-green-700">
                ${product.price.toFixed(2)}
              </span>
            </div>
            <Separator className="my-6 bg-green-100" />
            <div className="space-y-6">
              <div className="prose prose-green max-w-none">
                <h2 className="text-xl font-semibold text-green-700 mb-4">Product Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
              
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl
                })}
              >
                Add to Cart
              </Button>
            </div>
            <Separator className="my-6 bg-green-100" />
            <div className="text-sm text-gray-500">
              <p>Added: {new Date(product.createdAt).toLocaleDateString()}</p>
              <p>Last updated: {new Date(product.updatedAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
