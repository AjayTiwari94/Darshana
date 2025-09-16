// Simple MongoDB connection test with new password
const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = "mongodb+srv://darshana_25:okGoogle936%40@darshana.ekvcbxq.mongodb.net/darshana?retryWrites=true&w=majority";
  
  console.log('Testing MongoDB connection with new password...');
  console.log('Connecting to:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log("✅ Connected successfully to MongoDB server");
    
    // Test database access
    const db = client.db('darshana');
    const collections = await db.listCollections().toArray();
    console.log("Collections in 'darshana' database:");
    collections.forEach(collection => console.log(` - ${collection.name}`));
    
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('🔑 Authentication Error: Check your username and password');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('🌐 Connection Error: Check your internet connection and cluster URL');
    } else if (error.message.includes('IP not whitelisted')) {
      console.error('🚫 IP Access Error: Add your IP address to MongoDB Atlas Network Access');
    }
  } finally {
    await client.close();
  }
}

testConnection();