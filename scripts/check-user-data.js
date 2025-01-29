const clientPromise = require('../lib/db').default;

async function checkUserData() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Get all users
    const users = await db.collection('users').find({}).toArray();

    console.log('\n=== User Data Check ===\n');
    users.forEach(user => {
      console.log(`User: ${user.email}`);
      console.log('Credit:', user.credit);
      console.log('Credit type:', typeof user.credit);
      console.log('Full user data:', {
        ...user,
        password: '[REDACTED]',
        _id: user._id.toString()
      });
      console.log('-------------------\n');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkUserData();
