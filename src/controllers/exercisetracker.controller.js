const path = require('path');
const UserExercise = require('../db/model/exercisetracker.model');

const homePage = (req, res) => {
    const indexPath = path.join(__dirname, '../../views/index.html');
    res.sendFile(indexPath);
};

const createUser = async (req, res) => {
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

module.exports = { homePage, createUser, getAllUsers };
