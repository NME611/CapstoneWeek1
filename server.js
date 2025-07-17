const express = require('express');
const path = require('path');
const app = express();
const PORT = 4000;
const da = require("./data-access");


// Serve static files from the 'public' directory
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



app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
