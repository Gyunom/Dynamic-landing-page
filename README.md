# Dynamic Web Application Deployment
This README details the steps I took to provision a cloud server, set up a web server, deploy a dynamic landing page, and secure it, fulfilling the objectives outlined in the exam project requirements.

## 1. Server Provisioning (AWS EC2 - Ubuntu)
- **Objective:** Provision a virtual server using a cloud provider with an Ubuntu distribution.  
- **Cloud Provider:** I chose Amazon Web Services (AWS) EC2 because of its robust infrastructure, scalability, and free tier services.  
- **Operating System:**  I launched an Ubuntu Server LTS (Long Term Support) instance to provide a stable and widely supported environment for deployment.  
- **Instance Type:** I selected a suitable instance type, t2.micro, for cost-effectiveness during my exercise.  
- **Key Pair:** I generated a new SSH key pair and downloaded it, enabling secure SSH access to the instance.  
- **Security Group:** I had initially created a security group that was configured to allow SSH access (Port 22) from my IP address. This was later expanded for web traffic.

## 2. Web Server Setup (Nginx with Node.js Reverse Proxy)
**Objective:** Install a web server (Nginx) and configure it as a reverse proxy for a Node.js application.

**Node.js & npm Installation:**  
- Node.js and npm (Node Package Manager) were installed on my Ubuntu EC2 instance using the NodeSource repository for a stable and up-to-date version.

**Nginx Installation:**  
- Nginx was installed on the EC2 instance using the command: `sudo apt update && sudo apt install nginx -y`.

**Project Directory Setup:**  
- I created a dedicated directory for the application: `/var/www/landing-page`.  
- All project files (`index.html`, `styles.css`, `script.js`, `assets/`, `package.json`, `index.js`) were placed directly within `/var/www/landing-page/`.

**Node.js Application Setup:**  
- An `index.js` file was created as the entry point for the Node.js Express application.  
- Express.js Installation: `npm install express` was executed in the project directory.  
The `index.js` was configured to:
- Listen on `http://localhost:3000`.
- Use `express.json()` middleware to parse JSON request bodies (This is important for the contact form).
- I used `express.static(__dirname)` to serve all static files (HTML, CSS, JS, images) from the `/var/www/landing-page/` directory.
- I defined a POST route for `/submit-contact` to receive and log form submissions.
- I also included a generic 404 Not Found fallback for unhandled routes.

**Process Management with PM2:**  
- PM2 was installed globally: `sudo npm install pm2@latest -g`.  
- The Node.js application was started and managed by PM2: `pm2 start index.js --name "landing-page-app"`.  
PM2 was configured to start on boot: `pm2 startup systemd` and `pm2 save`.

**Nginx Reverse Proxy Configuration:**  
- The default Nginx configuration file (`/etc/nginx/sites-available/default`) was modified to act as a reverse proxy.  
- It was configured to listen on ports 80 (HTTP) and 443 (HTTPS).  
- All incoming requests were `proxy_pass`ed to the Node.js application running on `http://localhost:3000`. This allows Nginx to handle the external web traffic while Node.js processes the application logic and serves all content.  
- To forward client information, I included appropriate `proxy_set_header` directives.

## 3. Dynamic Landing Page (Features & Structure)
**Objective:** Create a personalised, dynamic landing page with specific content and interactive enhancements.

**Personalisation:**
- Name & Role: "Gyunom Maigida | Lead Cloud Engineer" is prominently displayed.
- Project Title: "The Future of Renewable Energy" is used as the core concept.
- Short Pitch & Bio: A concise pitch and a professional bio highlighting skills (AWS, Docker, AltSchool Africa training, legal background) and past projects are included.

**Content Structure:**  
The page is structured as a single-page application (SPA) with distinct sections:
- Home (#home): Main introduction, profile image, pitch, and bio.
- About (#about): Detailed professional background.
- Portfolio (#projects): Showcasing project cards with images and descriptions.
- Contact (#contact): A form for user inquiries.

**Optional Enhancements (Dynamic Features):**
- **CSS Animations:** I applied a fade-in animation to key sections for a smooth entry effect. Hover transitions were used on navigation links and social media icons.
- **Lightweight Framework (Tailwind CSS):** Most of the styling was built using Tailwind CSS utility classes, providing a modern and responsive design.
- **Typewriter Effect:** The tagline "The Future of Renewable Energy" dynamically types itself out on page load using JavaScript and CSS animations, creating an engaging visual.
- **Smooth Scrolling Navigation:** Clicking on navigation links (Home, About, Portfolio, Contact) triggers a smooth scroll to the respective sections on the page.
- **"Back to Top" Button:** I provisioned a floating button to appear when the user scrolls down, allowing for quick, smooth navigation back to the top of the page. This button is dynamically shown/hidden with JavaScript.
- **Interactive Image Modal:** In the "My Projects" section, clicking on any project image opens it in a full-screen modal pop-up, providing a larger view of the image. This modal can be closed by clicking an 'X' button or anywhere outside the image.
- **Dynamic Contact Form with Pop-up Response:** The "Connect With Me" form is a dynamic feature where client-side JavaScript (`script.js`) intercepts the form submission, preventing a page reload. It uses the fetch API to send form data (name, email, message) to the POST `/submit-contact` endpoint on the Node.js server. The server then processes this data (it's currently configured to log it) and returns a personalised success message. Upon receiving this message, the client-side JavaScript displays a themed pop-up modal, containing the personalised "Thank you, [Name]! Your message has been received..." message, providing immediate feedback to the user without leaving the page.

## 4. Networking & Security (Production-Ready)
**Objective:** Ensure the application is accessible via HTTP/HTTPS and secured with SSL.

**Firewall Configuration (AWS Security Groups):**  
AWS Security Group inbound rules were updated to allow:
- HTTP (Port 80): From Anywhere-IPv4 (0.0.0.0/0).
- HTTPS (Port 443): From Anywhere-IPv4 (0.0.0.0/0).
- SSH (Port 22): Restricted to my IP address for security.

**Custom Domain (DuckDNS):**  
- A DuckDNS domain (`maigida.duckdns.org`) was configured to point to the EC2 instance's public IP address.  
- (If dynamic IP): A cron job was set up on the EC2 instance to periodically update the DuckDNS record with the instance's current public IP, ensuring continuous domain resolution. (Note: Using an Elastic IP is recommended for static IPs, removing the need for this script, but due to the fact that I am using the free tier a static IP was preferred).

**SSL Encryption (Certbot):**  
- I installed certbot using  `sudo apt install certbot python3-certbot-nginx -y`.  
- I obtained an SSL certificate and configured it for `maigida.duckdns.org` using `sudo certbot --nginx -d maigida.duckdns.org`.  
- After that, certbot automatically configured Nginx to redirect all HTTP (Port 80) traffic to HTTPS (Port 443), ensuring secure connections by default.  
- Certbot also set up automatic renewal of the SSL certificate.

**Public IP Address:**  
- The application is hosted at: [http://13.40.198.127/](http://13.40.198.127/)  
- It is also accessible via the custom domain (with HTTPS redirection): [https://maigida.duckdns.org/](https://maigida.duckdns.org/)
