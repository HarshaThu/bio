import clientPromise, { dbName } from '@/lib/db'
import ProductsList from './products-list'

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

async function getProducts(): Promise<Product[]> {
  try {
    console.log('Attempting to connect to MongoDB...');
    const client = await clientPromise;
    console.log('Successfully connected to MongoDB client');
    
    const db = client.db(dbName);
    console.log('Using database:', dbName);
    
    const productsCollection = db.collection('products');
    console.log('Accessing products collection...');
    
    const products = await productsCollection
      .find()
      .sort({ name: 1 })
      .toArray() as MongoProduct[];
    
    console.log(`Found ${products.length} products`);

    return products.map(product => ({
      id: parseInt(product._id.toString().substring(0, 8), 16),
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt)
    }));
  } catch (error: any) {
    console.error('Failed to fetch products:', error);
    // Only log error details if they exist
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    } else {
      console.error('Unknown error type:', error);
    }
    return []; // Return empty array on error
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-yellow-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center mb-12">
            <h1 className="text-4xl font-bold text-green-800 mb-4">Organic Garden Products</h1>
            <p className="text-lg text-red-600 max-w-2xl text-center">
              Unable to load products at this time. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-yellow-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Organic Garden Products</h1>
          <p className="text-lg text-green-600 max-w-2xl text-center">
            Nurture your garden with our premium selection of organic fertilizers and natural pesticides
          </p>
        </div>
        <ProductsList products={products} />
      </div>
    </div>
  )
}
