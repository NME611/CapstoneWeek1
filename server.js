const express = require('express');
const path = require('path');
const app = express();
const PORT = 4000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
