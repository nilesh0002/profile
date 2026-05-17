const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all feedback
app.get('/api/feedback', async (req, res) => {
    try {
        const feedback = await prisma.feedback.findMany({
            orderBy: { createdAt: 'desc' }
        });
        // Map to match the frontend expected format if necessary, though it seems they can just use 'createdAt'
        res.json(feedback.map(f => ({ ...f, date: f.createdAt })));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
});

// Submit new feedback
app.post('/api/feedback', async (req, res) => {
    const { rating, message } = req.body;
    
    try {
        const newFeedback = await prisma.feedback.create({
            data: {
                rating,
                message,
            }
        });
        res.json({ ...newFeedback, date: newFeedback.createdAt });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create feedback' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 