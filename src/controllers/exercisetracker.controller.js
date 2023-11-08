const path = require('path');
const UserExercise = require('../db/model/exercisetracker.model');

const homePage = (req, res) => {
    const indexPath = path.join(__dirname, '../../views/index.html');
    res.sendFile(indexPath);
};

const addUser = async (req, res) => {
    const { username } = req.body;
    const newUser = new UserExercise({
        username,
    });
    await newUser
        .save()
        .then((savedUser) => {
            res.json({
                message: 'berhasil',
                username: savedUser.username,
                _id: savedUser._id,
            });
            return;
        })
        .catch((error) => {
            res.json({
                message: 'gagal',
                error: error.message,
            });
            return;
        });
};

const getAllUsers = async (req, res) => {
    const find = await UserExercise.find();
    const findAllUsers = find.map((user) => {
        return { username: user.username, _id: user._id };
    });
    res.json(findAllUsers);
};

const addExercises = async (req, res) => {
    const { _id } = req.params;
    let { date, duration, description } = req.body;
    const findUser = await UserExercise.findById(_id);
    if (!date) {
        date = new Date();
    }
    const newExercises = {
        description,
        duration,
        date,
    };
    findUser.log.push(newExercises);
    findUser.count = findUser.log.length;
    await findUser
        .save()
        .then(() => {
            res.json({
                _id,
                username: findUser.username,
                date: new Date(date).toDateString(),
                duration: Number(duration),
                description,
            });
            return;
        })
        .catch((error) => {
            res.json({
                message: 'gagal',
                error: error.message,
            });
            return;
        });
};

const getDetailById = async (req, res) => {
    const { _id } = req.params;
    try {
        const getAll = await UserExercise.findById(_id);
        const dateToString = await getAll.log.map((exercise) => {
            return {
                description: exercise.description,
                duration: exercise.duration,
                date: new Date(exercise.date).toDateString(),
            };
        });
        const newRespon = {
            _id: getAll._id,
            username: getAll.username,
            count: getAll.count,
            log: dateToString,
        };
        res.json(newRespon);
    } catch (error) {
        res.json({
            message: error.message,
        });
    }
};

module.exports = {
    homePage,
    addUser,
    getAllUsers,
    addExercises,
    getDetailById,
};
