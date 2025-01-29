import { MongoClient } from "mongodb";
import { Tool } from "langchain/tools";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

export class ProductSearchTool extends Tool {
  name = "product_search";
  description = "Search for gardening products based on keywords and categories";

  async _call(input: string) {
    const client = await MongoClient.connect(uri);
    const db = client.db();

    try {
      const keywords = input.toLowerCase().split(' ');
      const relevantCategories = [
        'Growing Media', 'Nutrients', 'Fertilizers', 'Plant Protection',
        'Tools', 'Equipment', 'Plant Health', 'Soil Amendments'
      ];

      const products = await db.collection('products')
        .find({
          $or: [
            { category: { $in: relevantCategories } },
            {
              $or: [
                { name: { $regex: keywords.join('|'), $options: 'i' } },
                { description: { $regex: keywords.join('|'), $options: 'i' } }
              ]
            }
          ]
        })
        .limit(3)
        .toArray();

      return JSON.stringify(products.map(product => ({
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category
      })));
    } finally {
      await client.close();
    }
  }
}
