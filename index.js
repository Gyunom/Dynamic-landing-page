// index.js (using Express.js)
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const staticFilesPath = __dirname;

app.use(express.json());

app.use(express.static(staticFilesPath));

app.post('/submit-contact', (req, res) => {
    const { name, email, message } = req.body;

    console.log('--- New Contact Form Submission ---');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    console.log('---------------------------------');

    if (name && email && message) {
        res.status(200).json({ message: 'Message sent successfully!' });
    } else {
        res.status(400).json({ message: 'Please fill in all fields.' });
    }
});

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(port, () => {
    console.log(`Node.js app (Express) listening on port ${port}`);
});
