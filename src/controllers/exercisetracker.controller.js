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
    const { from, to, limit } = req.query;
    try {
        const getAllById = await UserExercise.findById(_id);

        // if queries is exists
        if (from || to) {
            let toDate;
            if (to) {
                toDate = new Date(to);
                toDate.setDate(toDate.getDate() + 1); // add one day to 'to' date
            }
            const logByQueries = getAllById.log
                .filter(
                    (log) =>
                        (!to ||
                            new Date(log.date).getTime() < toDate.getTime()) &&
                        (!from ||
                            new Date(log.date).getTime() >=
                                new Date(from).getTime())
                )
                .map((log) => {
                    return {
                        description: log.description,
                        duration: log.duration,
                        date: new Date(log.date).toDateString(),
                    };
                });
            if (limit) {
                const logLimit = logByQueries.splice(0, Number(limit));
                const newResponIfLimitExist = {
                    _id: getAllById._id,
                    username: getAllById.username,
                    from: new Date(from).toDateString(),
                    count: logLimit.length,
                    log: logLimit,
                };
                return res.json(newResponIfLimitExist);
            }
            const newResponIfLimitNotExist = {
                _id: getAllById._id,
                username: getAllById.username,
                from: new Date(from).toDateString(),
                count: logByQueries.length,
                log: logByQueries,
            };
            return res.json(newResponIfLimitNotExist);
        }

        const dateToString = await getAllById.log.map((log) => {
            return {
                description: log.description,
                duration: log.duration,
                date: new Date(log.date).toDateString(),
            };
        });

        const newResponIfQueriesNotExists = {
            _id: getAllById._id,
            username: getAllById.username,
            count: getAllById.log.length,
            log: dateToString,
        };
        return res.json(newResponIfQueriesNotExists);
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
