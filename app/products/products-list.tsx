'use client'

import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/CartContext"
import Link from 'next/link'

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

export default function ProductsList({ products }: { products: Product[] }) {
  const { addToCart } = useCart()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product: Product) => (
        <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-green-100">
          <CardHeader className="p-0">
            <div className="relative h-48 overflow-hidden rounded-t-lg bg-sage-100">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
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
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-green-800 mb-2 group-hover:text-green-600">
              {product.name}
            </h3>
            <p className="text-gray-600 mb-4">
              {product.description}
            </p>
            <Separator className="my-4 bg-green-100" />
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-green-700">
                ${product.price.toFixed(2)}
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  onClick={() => addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl
                  })}
                >
                  Add to Cart
                </Button>
                <Link href={`/products/${product.id}`}>
                  <Button 
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
