const { MongoClient } = require('mongodb');

const url = "mongodb://localhost:27017";
const dbName = "custdb";

let client;
let db;
let collection;

// Connect once and reuse the connection
async function connectDB() {
  if (!client) {
    client = new MongoClient(url);
    await client.connect();
    db = client.db(dbName);
    collection = db.collection("customers");
  }
  return collection;
}

async function getCustomers() {
  try {
    const col = await connectDB();
    const customers = await col.find({}).toArray();
    //throw {"message":"an error occured"}; // <-- add this line
    return [customers, null];
  } catch (err) {
    console.log(err.message);
    return [null, err.message];
  }
}



module.exports = {
  getCustomers
};
