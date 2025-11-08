const path = require('path');

exports.showLandingPage = (req, res) => {
  const viewsPath = path.join(process.cwd(), 'presentation', 'static', 'views');
  res.sendFile(path.join(viewsPath, 'landingpage.html'));
};
exports.showDocumentationPage = (req, res) => {
  const viewsPath = path.join(process.cwd(), 'presentation', 'static', 'views');
  res.sendFile(path.join(viewsPath, 'documentation.html'));
};
exports.showFeaturePage = (req, res) => {
  const viewsPath = path.join(process.cwd(), 'presentation', 'static', 'views');
  res.sendFile(path.join(viewsPath, 'features.html'));
};
