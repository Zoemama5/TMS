const path = require('path');

exports.showLandingPage = (req, res) => {
  const viewsPath = path.join(process.cwd(), 'presentation', 'static', 'views');
  res.sendFile(path.join(viewsPath, 'landingpage.html'));
};
