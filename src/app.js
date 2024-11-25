const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Example API endpoint
app.get('/api/data', (req, res) => {
    res.json({ message: 'Welcome to Project C API!' });
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Project C is running on http://localhost:${PORT}`);
});
