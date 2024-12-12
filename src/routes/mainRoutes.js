// mainRoutes


const express = require('express');
const axios = require('axios');
const router = express.Router();
const { PROJECT_F_URL, PROJECT_B_URL } = require('../../config/const');

// In-memory storage for logs and metrics (for simplicity; use a database for production)
const logs = [];
const metrics = {
    userActivity: [],
    apiUsage: {},
    systemHealth: {}
};

// ------------------- API STATUS ROUTE ------------------- //

router.get('/api/status', (req, res) => {
  res.json({
      status: 'active',
      version: '1.0',
      message: 'Project C (Metrics Console) is running'
  });
});


// ------------------- LOGGING ROUTES ------------------- //

// Route to receive logs from other projects
router.post('/api/logs', (req, res) => {
    const { service, level, message, timestamp = new Date().toISOString() } = req.body;

    logs.push({ service, level, message, timestamp });
    console.log(`[${service}] [${level}] ${message}`);

    res.status(200).json({ message: 'Log received successfully' });
});

// Fetch all logs
router.get('/api/logs', (req, res) => {
    res.json({ logs });
});

// ------------------- USER ACTIVITY ROUTES ------------------- //

// Track user activity
router.post('/api/user-activity', (req, res) => {
    const { userId, action, details, timestamp = new Date().toISOString() } = req.body;

    metrics.userActivity.push({ userId, action, details, timestamp });
    console.log(`User Activity: ${userId} performed ${action}`);

    res.status(200).json({ message: 'User activity recorded successfully' });
});

// Fetch user activity
router.get('/api/user-activity', (req, res) => {
    res.json({ userActivity: metrics.userActivity });
});

// ------------------- API USAGE ROUTES ------------------- //

// Track API usage
router.post('/api/api-usage', (req, res) => {
    const { endpoint, method, count = 1 } = req.body;

    const key = `${method} ${endpoint}`;
    metrics.apiUsage[key] = (metrics.apiUsage[key] || 0) + count;

    res.status(200).json({ message: 'API usage recorded successfully' });
});

// Fetch API usage metrics
router.get('/api/api-usage', (req, res) => {
    res.json({ apiUsage: metrics.apiUsage });
});

// ------------------- SYSTEM HEALTH ROUTES ------------------- //

// Check the health of all services
router.get('/api/health', async (req, res) => {
    const services = {
        ProjectA: 'http://localhost:3001/api/status',
        ProjectB: 'http://localhost:3002/api/status',
        ProjectD: 'http://localhost:3004/api/status',
        ProjectE: 'http://localhost:3005/api/status',
        ProjectF: 'http://localhost:3006/api/status'
    };

    const healthChecks = await Promise.all(
        Object.entries(services).map(async ([name, url]) => {
            try {
                const response = await axios.get(url);
                return { name, status: response.data.status, message: response.data.message };
            } catch (error) {
                return { name, status: 'unreachable', message: error.message };
            }
        })
    );

    metrics.systemHealth = healthChecks;

    res.json({ systemHealth: healthChecks });
});

// ------------------- ANALYTICS ROUTES ------------------- //

// Aggregate user activity and API usage
router.get('/api/analytics', (req, res) => {
    res.json({
        userActivityCount: metrics.userActivity.length,
        apiUsage: metrics.apiUsage,
        systemHealth: metrics.systemHealth
    });
});

module.exports = router;
