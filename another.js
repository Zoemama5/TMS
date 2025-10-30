// server.js
const app = require('./presentation/app'); // <-- Import your app.js

const PORT = process.env.PORT || 3000;

// Run the app instance
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
