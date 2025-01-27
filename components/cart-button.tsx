import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/CartContext"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

export function CartButton() {
  const { totalItems } = useCart()

  return (
    <Link href="/cart">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
      >
        <ShoppingCart className="h-5 w-5 text-green-700" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Button>
    </Link>
  )
}
