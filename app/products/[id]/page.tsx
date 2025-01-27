import { PrismaClient } from '@prisma/client'
import ProductDetails from './product-details'
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(id)
    }
  })
  return product
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return <ProductDetails product={product} />
}
