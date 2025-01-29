const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
};

interface Product {
  _id: typeof ObjectId;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const products: Omit<Product, '_id'>[] = [
  {
    name: "Enriched Cocopeat",
    description: "Organic growing medium for optimal plant growth",
    price: 15,
    imageUrl: "/products/cocopeat.jpg",
    category: "Growing Media",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Vermiculite",
    description: "Natural mineral for soil aeration and moisture retention",
    price: 13,
    imageUrl: "/products/vermiculite.jpg",
    category: "Growing Media",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Perlite",
    description: "Volcanic glass for improved soil drainage",
    price: 13,
    imageUrl: "/products/perlite.jpg",
    category: "Growing Media",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Phytosil",
    description: "Silicon supplement for plant strength",
    price: 16,
    imageUrl: "/products/phytosil.jpg",
    category: "Nutrients",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Organic Health Booster",
    description: "Natural plant health enhancer",
    price: 15,
    imageUrl: "/products/health-booster.jpg",
    category: "Nutrients",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Vermicompost",
    description: "Earthworm-produced organic fertilizer",
    price: 12,
    imageUrl: "/products/vermicompost.jpg",
    category: "Fertilizers",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Grow Cubes",
    description: "Growing medium for seedlings and cuttings",
    price: 10,
    imageUrl: "/products/grow-cubes.jpg",
    category: "Growing Media",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Rose Mixture",
    description: "Specialized soil mix for roses",
    price: 15,
    imageUrl: "/products/rose-mixture.jpg",
    category: "Growing Media",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Garden Mix",
    description: "All-purpose garden soil mix",
    price: 13,
    imageUrl: "/products/garden-mix.jpg",
    category: "Growing Media",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Hydroponic Mix",
    description: "Nutrient solution for hydroponic systems",
    price: 17,
    imageUrl: "/products/hydroponic-mix.jpg",
    category: "Nutrients",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Liquid Plant Food",
    description: "Quick-absorbing liquid fertilizer",
    price: 14,
    imageUrl: "/products/liquid-food.jpg",
    category: "Nutrients",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Humus",
    description: "Humic acid for soil improvement",
    price: 15,
    imageUrl: "/products/humus.jpg",
    category: "Soil Amendments",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Seaweed",
    description: "Mineral-rich natural growth stimulant",
    price: 16,
    imageUrl: "/products/seaweed.jpg",
    category: "Nutrients",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Panchagavya",
    description: "Traditional organic growth promoter",
    price: 15,
    imageUrl: "/products/panchagavya.jpg",
    category: "Nutrients",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Soil Moisture Meter",
    description: "Digital soil moisture measurement tool",
    price: 17,
    imageUrl: "/products/moisture-meter.jpg",
    category: "Tools",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Miracle Tabs",
    description: "Bio-tablets for root disease prevention",
    price: 12,
    imageUrl: "/products/miracle-tabs.jpg",
    category: "Plant Health",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Garden Lighting",
    description: "LED lights for garden illumination",
    price: 17,
    imageUrl: "/products/garden-light.jpg",
    category: "Equipment",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Bamboo Based Flower Pots",
    description: "Eco-friendly bamboo plant containers",
    price: 15,
    imageUrl: "/products/bamboo-pots.jpg",
    category: "Containers",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Gravel (Arham craft) Jodhpur",
    description: "Decorative Jodhpur gravel for landscaping",
    price: 12,
    imageUrl: "/products/gravel.jpg",
    category: "Decorative",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Fertilizer Bullets",
    description: "Slow-release fertilizer capsules",
    price: 13,
    imageUrl: "/products/fertilizer-bullets.jpg",
    category: "Fertilizers",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Plant Extracts for Pest Control",
    description: "Natural pest control solution",
    price: 15,
    imageUrl: "/products/pest-control.jpg",
    category: "Plant Protection",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Oil for Fungus Control",
    description: "Natural fungal disease control",
    price: 15,
    imageUrl: "/products/fungus-control.jpg",
    category: "Plant Protection",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Grow Lights",
    description: "Full-spectrum LED grow lights",
    price: 17,
    imageUrl: "/products/grow-lights.jpg",
    category: "Equipment",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Natural Grow Pellets",
    description: "Compressed organic fertilizer pellets",
    price: 14,
    imageUrl: "/products/grow-pellets.jpg",
    category: "Fertilizers",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedProducts() {
  try {
    const client = await MongoClient.connect(uri, options);
    const db = client.db();

    // Clear existing products
    await db.collection('products').deleteMany({});

    // Insert new products
    const result = await db.collection('products').insertMany(products);
    
    console.log('Database seeded successfully!');
    console.log(`Inserted ${result.insertedCount} products`);
    
    // Close the connection
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedProducts();
