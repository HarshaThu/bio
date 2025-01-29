import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  compact?: boolean;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  imageUrl,
  category,
  compact = true
}: ProductCardProps) {
  return (
    <Card className={`overflow-hidden ${compact ? 'w-[200px]' : 'w-full'}`}>
      <div className="relative h-[120px]">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-3 space-y-2">
        <h3 className="font-medium text-sm">{name}</h3>
        {!compact && (
          <p className="text-muted-foreground text-sm line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="font-semibold">${price}</span>
          <Button size="sm" variant="outline">
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}
