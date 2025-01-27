import { PrismaClient } from '@prisma/client'
import ProductsList from './products-list'

const prisma = new PrismaClient()

async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: {
      name: 'asc'
    }
  })
  return products
}

export default async function ProductsPage() {
  const products = await getProducts()

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
