const mongoose = require('mongoose');

// Test connection to MongoDB Atlas
const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    
    // Try to connect to the MongoDB cluster without specifying a database
    const uri = 'mongodb+srv://darshana_25:%3CokGoogle936%23%3E@darshana.ekvcbxq.mongodb.net';
    
    console.log('Connecting to:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ Connected to MongoDB cluster successfully');
    
    // List databases
    const db = mongoose.connection;
    const admin = db.db.admin();
    const dbs = await admin.listDatabases();
    console.log('Available databases:', dbs.databases.map(d => d.name));
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('🔑 Authentication Error: Check your username and password');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('🌐 Connection Error: Check your internet connection and cluster URL');
    } else if (error.message.includes('IP not whitelisted')) {
      console.error('🚫 IP Access Error: Add your IP address to MongoDB Atlas Network Access');
    }
  }
};

testConnection();