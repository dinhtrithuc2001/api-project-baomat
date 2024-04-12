const express = require('express')
const app = express();
const mongoose = require('mongoose')
const Tool = require('./models/toolModel')
const crypto = require('crypto')
const cors = require('cors');
const User = require('./models/userModel');

app.use(express.json())
app.use(cors());

function logRequestToDatabase(name, type, description) {
    const tool = new Tool({
        name,
        type,
        description
    });

    tool.save().catch(err => console.error('Failed to log to database:', err));
}

app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = await User.create({
            username,
            password
        });
        res.status(201).json({
            status: 'success',
            data: {
                userId: newUser._id
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect username or password'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                userId: user._id
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
});

// Text Encoding and Decoding
app.post('/api/encode', (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }
        const encoded = Buffer.from(text).toString('base64');
        logRequestToDatabase('Encode Base64', 'Text', `Encoding text to Base64: ${text}`);
        res.status(200).json({ encoded });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/decode', (req, res) => {
    try {
        const { encoded } = req.body;
        if (!encoded) {
            return res.status(400).json({ error: 'No encoded text provided' });
        }
        const decoded = Buffer.from(encoded, 'base64').toString('ascii');
        logRequestToDatabase('Decode Base64', 'Text', `Decoding Base64 to text: ${encoded}`);
        res.status(200).json({ decoded });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Hex Encoding and Decoding
app.post('/api/encodeHex', (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }
        const encoded = Buffer.from(text).toString('hex');
        logRequestToDatabase('Encode Hex', 'Hex', `Encoding text to Hex: ${text}`);
        res.status(200).json({ encoded });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/decodeHex', (req, res) => {
    try {
        const { encoded } = req.body;
        if (!encoded) {
            return res.status(400).json({ error: 'No encoded text provided' });
        }
        const decoded = Buffer.from(encoded, 'hex').toString('ascii');
        logRequestToDatabase('Decode Hex', 'Hex', `Decoding Hex to text: ${encoded}`);
        res.status(200).json({ decoded });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// MD5 Encoding
app.post('/api/encodeMd5', (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }
        const hash = crypto.createHash('md5').update(text).digest('hex');
        logRequestToDatabase('Encode MD5', 'Md5', `MD5 hash of text: ${text}`);
        res.status(200).json({ md5: hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


mongoose.set("strictQuery", false)
mongoose.
    connect('mongodb+srv://admin:123456A@thucdinhapinode.mfajvas.mongodb.net/Node-API?retryWrites=true&w=majority&appName=ThucDinhApiNode')
    .then(() => {
        console.log('connected to mongoDB')
        app.listen(3001, () => {
            console.log("NODE API APP IS RUNNING ON PORT 3001")
        })
    }).catch((error) => {
        console.log(error)
    })