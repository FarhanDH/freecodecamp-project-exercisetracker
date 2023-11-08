const {
    homePage,
    getAllUsers,
    addUser,
    addExercises,
    getDetailById,
} = require('../controllers/exercisetracker.controller');

const router = require('express').Router();

router.get('/', homePage);
router.get('/api/users', getAllUsers);
router.post('/api/users', addUser);
router.post('/api/users/:_id/exercises', addExercises);
router.get('/api/users/:_id/logs', getDetailById);

module.exports = router;
