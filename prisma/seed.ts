import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Organic Neem Oil Pesticide',
    description: 'Natural neem oil-based pesticide for organic gardening',
    price: 24.99,
    imageUrl: '/images/products/neem-oil.jpg',
    category: 'Pesticides'
  },
  {
    name: 'Cow Manure Fertilizer',
    description: 'Rich organic cow manure compost for enhanced soil fertility',
    price: 19.99,
    imageUrl: '/images/products/cow-manure.jpg',
    category: 'Fertilizers'
  },
  {
    name: 'Organic Fish Emulsion',
    description: 'Liquid fish fertilizer for rapid plant growth',
    price: 29.99,
    imageUrl: '/images/products/fish-emulsion.jpg',
    category: 'Fertilizers'
  },
  {
    name: 'Natural Pyrethrin Spray',
    description: 'Botanical insecticide derived from chrysanthemum flowers',
    price: 22.99,
    imageUrl: '/images/products/pyrethrin.jpg',
    category: 'Pesticides'
  },
  {
    name: 'Bone Meal Fertilizer',
    description: 'Phosphorus-rich organic fertilizer for root development',
    price: 15.99,
    imageUrl: '/images/products/bone-meal.jpg',
    category: 'Fertilizers'
  },
  {
    name: 'Vermicompost',
    description: 'Premium worm castings for organic soil enrichment',
    price: 27.99,
    imageUrl: '/images/products/vermicompost.jpg',
    category: 'Fertilizers'
  },
  {
    name: 'Diatomaceous Earth',
    description: 'Natural pest control powder for organic gardens',
    price: 18.99,
    imageUrl: '/images/products/diatomaceous.jpg',
    category: 'Pesticides'
  },
  {
    name: 'Chicken Manure Pellets',
    description: 'Concentrated organic chicken manure fertilizer',
    price: 21.99,
    imageUrl: '/images/products/chicken-manure.jpg',
    category: 'Fertilizers'
  },
  {
    name: 'Copper Fungicide',
    description: 'Organic copper-based fungicide for disease control',
    price: 25.99,
    imageUrl: '/images/products/copper-fungicide.jpg',
    category: 'Pesticides'
  },
  {
    name: 'Seaweed Extract',
    description: 'Nutrient-rich seaweed fertilizer for plant growth',
    price: 23.99,
    imageUrl: '/images/products/seaweed.jpg',
    category: 'Fertilizers'
  }
];

async function main() {
  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
