const path = require('path');

exports.showLogInPage = (req, res) => {
  const viewsPath = path.join(process.cwd(), 'presentation', 'static', 'views');
  res.sendFile(path.join(viewsPath, 'login-page-final.html'));
};
