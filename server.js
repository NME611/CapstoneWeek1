const express = require('express');
const path = require('path');
const app = express();
const PORT = 4000;
const da = require("./data-access");
const bodyParser = require('body-parser');

// API Key middleware
function apiKeyMiddleware(req, res, next) {
  const apiKeyHeader = req.headers["x-api-key"];
  const validApiKey = process.env.API_KEY;

  if (!apiKeyHeader) {
    res.status(401).send("API Key is missing");
    return;
  }
  if (apiKeyHeader !== validApiKey) {
    res.status(403).send("API Key is invalid");
    return;
  }
  next();
}


// Serve static files from the 'public' directory
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get("/customers", async (req, res) => {
  const [cust, err] = await da.getCustomers();
  if (cust !== null) {
    res.send(cust);
  } else {
    res.status(500).send(err);
  }
});

app.get("/customers/:id", async (req, res) => {
  const id = req.params.id;
  const [cust, err] = await da.getCustomerById(id);

  if (cust !== null) {
    res.send(cust); // status 200 is default
  } else if (err === "Customer not found") {
    res.status(404).send(err);
  } else {
    res.status(500).send(err);
  }
});

app.get("/reset", async (req, res) => {
  const [status, err] = await da.resetCustomers();
  if (status === "success") {
    res.send("Customer data has been reset.");
  } else {
    res.status(500).send(err);
  }
});

app.get("/customers", apiKeyMiddleware, async (req, res) => {
  const [cust, err] = await da.getCustomers();
  if (cust !== null) {
    res.send(cust);
  } else {
    res.status(500).send(err);
  }
});



app.post("/customers",apiKeyMiddleware, async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send("missing request body");
    return;
  }
  const [status, id, err] = await da.addCustomer(req.body);
  if (status === "success") {
    req.body._id = id; // Attach the MongoDB _id to the object sent back
    res.status(201).send(req.body);
  } else {
    res.status(400).send(err);
  }
});

app.get("/customers/:id", async (req, res) => {
  const id = req.params.id;
  const [customer, errMsg] = await da.getCustomerById(id);

  if (customer === null) {
    res.status(404).send(errMsg);
  } else {
    res.send(customer);
  }
});

app.put("/customers/:id", apiKeyMiddleware, async (req, res) => {
  const updatedCustomer = req.body;
  const id = req.params.id;
  if (!updatedCustomer) {
    res.status(400).send("missing request body");
    return;
  }
  delete updatedCustomer._id;
  updatedCustomer.id = +id; // ensure numeric

  const [message, err] = await da.updateCustomer(updatedCustomer);
  if (message) {
    res.send(message); // <-- THIS LINE
  } else {
    res.status(400).send(err);
  }
});

app.delete("/customers/:id", apiKeyMiddleware, async (req, res) => {
  const id = req.params.id;
  const [message, errMsg] = await da.deleteCustomerById(id);

  if (message === null) {
    res.status(404).send(errMsg);
  } else {
    res.send(message);
  }
});






app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
