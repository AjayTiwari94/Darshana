// Simple MongoDB connection test
const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = "mongodb+srv://darshana_25:%3CokGoogle936%23%3E@darshana.ekvcbxq.mongodb.net/";
  
  console.log('Testing MongoDB connection...');
  console.log('Connecting to:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log("✅ Connected successfully to MongoDB server");
    
    // List database names
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    
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