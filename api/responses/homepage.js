const path = require('path');

module.exports = function homepage() {
  return this.res.sendFile(path.join(__dirname, '../../assets', 'index.html'));
};
