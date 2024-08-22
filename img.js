const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Function to get an authentication token
async function getAuthToken() {
    const response = await axios.post('https://api.magicstudio.com/auth/token', {
        client_id: 'fVvJStDs11hgtpnaWkk3NvzJ7xgTE9d91UAmiNpvEjc',
        client_secret: '81JuZnSAQL7sUTufpqywC12jkkhCgYYXT4C3hYZqvdE',
        expiry_days: 4
    });
    return response.data.token; // Adjust according to the actual response format
}

// Function to create an image
async function createImage(prompt, token) {
    const response = await axios.post('https://api.magicstudio.com/image/create', {
        prompt
    }, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data.imageUrl; // Adjust according to the actual response format
}

// New endpoint for handling text query parameter
app.get('/img-gen', async (req, res) => {
    const text = req.query.text;

    if (!text) {
        return res.status(400).json({ error: 'Text query parameter is required' });
    }

    try {
        const token = await getAuthToken();
        const imageUrl = await createImage(text, token);
        res.json({ imageUrl });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate image' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
