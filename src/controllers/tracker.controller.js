const path = require('path');

const homePage = (req, res) => {
    const indexPath = path.join(__dirname, '../../views/index.html');
    res.sendFile(indexPath);
};

const createUser = (req, res) => {};

module.exports = { homePage };
