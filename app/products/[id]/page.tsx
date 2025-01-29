import clientPromise from '@/lib/db'
import ProductDetails from './product-details'
import { notFound } from 'next/navigation'
import { ObjectId } from 'mongodb'

type MongoProduct = {
  _id: any;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

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

async function getProduct(id: string): Promise<Product | null> {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const product = await db.collection('products')
      .findOne({ _id: new ObjectId(id) }) as MongoProduct | null;

    if (!product) return null;

    return {
      id: parseInt(product._id.toString().substring(0, 8), 16),
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt)
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return <ProductDetails product={product} />
}
