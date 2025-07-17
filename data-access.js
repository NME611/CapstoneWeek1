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

async function getCustomerById(id) {
  try {
    const col = await connectDB();
    // Ensure id is numeric, as stored in Mongo
    const customer = await col.findOne({ id: Number(id) });
    if (customer) {
      return [customer, null];
    } else {
      return [null, 'Customer not found'];
    }
  } catch (err) {
    console.log(err.message);
    return [null, err.message];
  }
}

async function addCustomer(newCustomer) {
  try {
    const col = await connectDB();
    const result = await col.insertOne(newCustomer);
    // result.insertedId is the _id assigned by MongoDB
    return ["success", result.insertedId, null];
  } catch (err) {
    console.log(err.message);
    return ["fail", null, err.message];
  }
}

async function resetCustomers() {
  try {
    const col = await connectDB();
    // Delete all existing documents
    await col.deleteMany({});
    // Insert the default records
    await col.insertMany([
      { id: 0, name: "Mary Jackson", email: "maryj@abc.com", password: "maryj" },
      { id: 1, name: "Karen Addams", email: "karena@abc.com", password: "karena" },
      { id: 2, name: "Scott Ramsey", email: "scottr@abc.com", password: "scottr" }
    ]);
    return [ "success", null ];
  } catch (err) {
    return [ null, err.message ];
  }
}

async function getCustomerById(id) {
  try {
    const col = await connectDB();
    const customer = await col.findOne({ id: +id }); // "+" converts string to number
    if (customer) {
      return [customer, null];
    } else {
      return [null, "invalid customer number"];
    }
  } catch (err) {
    return [null, err.message];
  }
}

async function updateCustomer(updatedCustomer) {
  try {
    const col = await connectDB();
    const filter = { id: updatedCustomer.id };
    const update = { $set: updatedCustomer };
    const result = await col.updateOne(filter, update);
    if (result.matchedCount === 0) {
      return [null, "no record found to update"];
    }
    if (result.modifiedCount === 1) {
      return ["one record updated", null];
    }
    // No document was modified, but one matched - this means data was identical
    return ["record already up to date", null];
  } catch (err) {
    return [null, err.message];
  }
}





module.exports = { getCustomers, resetCustomers, addCustomer, getCustomerById, updateCustomer };







