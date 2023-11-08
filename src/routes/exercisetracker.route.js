const {
    homePage,
    createUser,
    getAllUsers,
} = require('../controllers/exercisetracker.controller');

const router = require('express').Router();

router.get('/', homePage);
router.get('/api/users', getAllUsers);
router.post('/api/users', createUser);

module.exports = router;
