const { homePage } = require('../controllers/tracker.controller');

const router = require('express').Router();

router.get('/', homePage);

module.exports = router;
