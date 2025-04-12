const express = require('express');
const path = require('path');
const app = express();

// Serve static assets (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'src/presentation/static/assets')));

// Serve the main HTML file from the 'views' folder
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'presentation', 'static', 'views', 'index.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.log("Error sending file:", err);
      res.status(500).send('Internal Server Error');
    }
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`TMS app is running at http://localhost:${PORT}`);
});
