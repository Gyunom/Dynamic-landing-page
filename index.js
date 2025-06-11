// index.js (using Express.js)
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const staticFilesPath = __dirname; // This is /var/www/landing-page/

app.use(express.static(staticFilesPath));

// Optionally, if you have specific dynamic routes, define them here.
// For a simple landing page, express.static might handle everything.
// Example: If you wanted a specific route for a form submission:
// app.post('/submit-form', (req, res) => {
//     // Handle form submission logic
//     res.send('Form submitted!');
// });

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(port, () => {
    console.log(`Node.js app (Express) listening on port ${port}`);
});
