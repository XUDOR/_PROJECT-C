const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios'); // For notifying Project F
const mainRoutes = require('./routes/mainRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003; // Project C port

// Enable CORS for all routes
app.use(cors());

// Middleware for parsing JSON
app.use(express.json());

// Middleware for serving static files
app.use(express.static(path.join(__dirname, '../public')));

// Use the main routes
app.use('/', mainRoutes);

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Notify Project F that Project C is running
const notifyProjectF = async () => {
    try {
        await axios.post('http://localhost:3006/api/notifications', {
            message: 'Project C (Metrics Console) is up and running'
        });
        console.log('Notified Project F: Project C is running');
    } catch (error) {
        console.error('Failed to notify Project F:', error.message);
    }
};

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Project C (Metrics Console) is running on http://localhost:${PORT}`);
    notifyProjectF(); // Send the notification when the server starts
});
