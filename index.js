const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies.
// This is essential for your server to read the form data sent from the frontend.
app.use(express.json());

// Serve static files from the current directory where index.js is located.
// This will make your index.html, styles.css, script.js, and any images/assets accessible.
const staticFilesPath = __dirname;
app.use(express.static(staticFilesPath));

// Route to handle POST requests for contact form submissions.
// This route will receive the form data, create a personalized message,
// and send it back to the client. It does NOT store data or send emails.
app.post('/submit-contact', (req, res) => {
    const { name, message } = req.body; // Extract name and message from the request body

    if (!name) {
        // Simple validation: ensure name is provided
        return res.status(400).json({ success: false, message: 'Name is required.' });
    }

    // Construct a personalized response message using the provided name
    const personalizedMessage = `Thank you, ${name}! Your message has been received. Please wait for an official response from the team.`;

    console.log('--- Form Submission Received (No Storage/Email) ---');
    console.log(`Name: ${name}`);
    console.log(`Message: ${message}`); // Log message, but not handling it further
    console.log('----------------------------------------------------');

    // Send a JSON response back to the client with the personalized message
    res.status(200).json({
        success: true,
        responseMessage: personalizedMessage
    });
});

// Generic 404 Not Found handler for any requests that don't match a static file or route.
app.use((req, res) => {
    res.status(404).send('Not Found');
});

// Start the Express server and listen on port 3000.
app.listen(port, () => {
    console.log('Node.js app (Express) listening on port', port);
});

