const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// This is important for my server to read the form data sent from the frontend.
app.use(express.json());

// Serve static files from the current directory where my index.js is located.
const staticFilesPath = __dirname;
app.use(express.static(staticFilesPath));

app.post('/submit-contact', (req, res) => {
    const { name, message } = req.body; 

    if (!name) {
        // This is a simple validation: ensure name is provided
        return res.status(400).json({ success: false, message: 'Name is required.' });
    }

    // This construct a personalised response message using the provided name
    const personalizedMessage = `Thank you, ${name}! Your message has been received. Please wait for an official response from the team.`;

    console.log('--- Form Submission Received (No Storage/Email) ---');
    console.log(`Name: ${name}`);
    console.log(`Message: ${message}`); 
    console.log('----------------------------------------------------');

    // This will send a JSON response back to the client with the personalised message
    res.status(200).json({
        success: true,
        responseMessage: personalizedMessage
    });
});

// This is the generic 404 Not Found handler for any requests that does not match a static file or route.
app.use((req, res) => {
    res.status(404).send('Not Found');
});

// This starts the Express server and listen on port 3000.
app.listen(port, () => {
    console.log('Node.js app (Express) listening on port', port);
});

