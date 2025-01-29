const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkUserCredit() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    const client = await MongoClient.connect(uri);
    const db = client.db();

    // Get all users and their credit
    const users = await db.collection('users').find({}, {
      projection: {
        email: 1,
        credit: 1,
        createdAt: 1,
        _id: 1
      }
    }).toArray();

    console.log('\n=== User Credit Check ===\n');
    users.forEach(user => {
      console.log(`User: ${user.email}`);
      console.log('Credit:', user.credit);
      console.log('Credit Type:', typeof user.credit);
      console.log('Created At:', user.createdAt);
      console.log('User ID:', user._id.toString());
      console.log('-------------------\n');
    });

    // Update any users with undefined or missing credit to 200
    const updateResult = await db.collection('users').updateMany(
      { 
        $or: [
          { credit: { $exists: false } },
          { credit: null },
          { credit: undefined }
        ]
      },
      { 
        $set: { 
          credit: 200,
          updatedAt: new Date()
        } 
      }
    );

    if (updateResult.modifiedCount > 0) {
      console.log(`Updated ${updateResult.modifiedCount} users with missing credit\n`);
      
      // Verify the updates
      console.log('=== Verifying Updates ===\n');
      const updatedUsers = await db.collection('users').find({}, {
        projection: {
          email: 1,
          credit: 1,
          updatedAt: 1
        }
      }).toArray();

      updatedUsers.forEach(user => {
        console.log(`User: ${user.email}`);
        console.log('New Credit Value:', user.credit);
        console.log('New Credit Type:', typeof user.credit);
        console.log('Last Updated:', user.updatedAt);
        console.log('-------------------\n');
      });
    } else {
      console.log('No users needed credit updates');
    }

    await client.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUserCredit();
