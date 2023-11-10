const path = require('path');
const UserExercise = require('../db/model/exercisetracker.model');

/**
 * Sends the home page HTML file as a response.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @return {object} The response object with the home page HTML file.
 */
const homePage = (req, res) => {
    const indexPath = path.join(__dirname, '../../views/index.html');
    return res.sendFile(indexPath);
};

/**
 * Adds a new user to the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Object} The response object containing a success message, the new username, and the new user's ID if successful, or an error message if unsuccessful.
 */
const addUser = async (req, res) => {
    const { username } = req.body;
    const newUser = new UserExercise({
        username,
    });
    await newUser
        .save()
        .then((savedUser) => {
            return res.json({
                message: 'berhasil',
                username: savedUser.username,
                _id: savedUser._id,
            });
        })
        .catch((error) => {
            return res.json({
                message: 'gagal',
                error: error.message,
            });
        });
};

/**
 * Retrieves all users and their information.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @return {object} An array of user objects with their usernames and IDs.
 */
const getAllUsers = async (req, res) => {
    const find = await UserExercise.find();
    const findAllUsers = find.map((user) => {
        return { username: user.username, _id: user._id };
    });
    return res.json(findAllUsers);
};

/**
 * Adds exercises to a user's log.
 *
 * @param {Object} req - the request object containing parameters and body
 * @param {Object} res - the response object to send back to the client
 * @return {Promise} a promise that resolves with the updated user's log or rejects with an error
 */
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
            return res.json({
                _id,
                username: findUser.username,
                date: new Date(date).toDateString(),
                duration: Number(duration),
                description,
            });
        })
        .catch((error) => {
            return res.json({
                message: 'gagal',
                error: error.message,
            });
        });
};

const getDetailById = async (req, res) => {
    const { _id } = req.params;
    const { from, to, limit } = req.query;
    try {
        const getAllById = await UserExercise.findById(_id);

        // if from and to queries is exists
        if (from && to) {
            let toDate;
            toDate = new Date(to);
            toDate.setDate(toDate.getDate() + 1); // add one day to 'to' date
            let logByFromAndToQueries = getAllById.log
                .filter(
                    (log) =>
                        new Date(log.date).getTime() < toDate.getTime() &&
                        new Date(log.date).getTime() >= new Date(from).getTime()
                )
                .map((log) => {
                    return {
                        description: log.description,
                        duration: log.duration,
                        date: new Date(log.date).toDateString(),
                    };
                });
            if (limit) {
                logByFromAndToQueries = logByFromAndToQueries.splice(
                    0,
                    Number(limit)
                );
                const responByToAndLimitQueries = {
                    _id: getAllById._id,
                    username: getAllById.username,
                    from: new Date(from).toDateString(),
                    to: new Date(to).toDateString(),
                    count: logByFromAndToQueries.length,
                    log: logByFromAndToQueries,
                };
                return res.json(responByToAndLimitQueries);
            }
            const responByToQueries = {
                _id: getAllById._id,
                username: getAllById.username,
                from: new Date(from).toDateString(),
                to: new Date(to).toDateString(),
                count: logByFromAndToQueries.length,
                log: logByFromAndToQueries,
            };
            return res.json(responByToQueries);
        }

        // if from query is exist
        if (from) {
            let logByFromQuery = getAllById.log
                .filter(
                    (log) =>
                        new Date(log.date).getTime() >= new Date(from).getTime()
                )
                .map((log) => {
                    return {
                        description: log.description,
                        duration: log.duration,
                        date: new Date(log.date).toDateString(),
                    };
                });

            if (limit) {
                logByFromQuery = logByFromQuery.splice(0, Number(limit));
                const responByFromAndLimitQueries = {
                    _id: getAllById._id,
                    username: getAllById.username,
                    from: new Date(from).toDateString(),
                    count: logByFromQuery.length,
                    log: logByFromQuery,
                };
                return res.json(responByFromAndLimitQueries);
            }
            const responByFromQueries = {
                _id: getAllById._id,
                username: getAllById.username,
                from: new Date(from).toDateString(),
                count: logByFromQuery.length,
                log: logByFromQuery,
            };
            return res.json(responByFromQueries);
        }

        // if to query is exist
        if (to) {
            let toDate;
            toDate = new Date(to);
            toDate.setDate(toDate.getDate() + 1); // add one day to 'to' date
            let logByToQuery = getAllById.log
                .filter(
                    (log) => new Date(log.date).getTime() < toDate.getTime()
                )
                .map((log) => {
                    return {
                        description: log.description,
                        duration: log.duration,
                        date: new Date(log.date).toDateString(),
                    };
                });
            if (limit) {
                logByToQuery = logByToQuery.splice(0, Number(limit));
                const responByToAndLimitQueries = {
                    _id: getAllById._id,
                    username: getAllById.username,
                    to: new Date(to).toDateString(),
                    count: logByToQuery.length,
                    log: logByToQuery,
                };
                return res.json(responByToAndLimitQueries);
            }
            const responByToQueries = {
                _id: getAllById._id,
                username: getAllById.username,
                to: new Date(to).toDateString(),
                count: logByToQuery.length,
                log: logByToQuery,
            };
            return res.json(responByToQueries);
        }

        // if limit query exist
        if (limit) {
            const logByLimitQuery = getAllById.log.splice(0, Number(limit));
            const responByLimitQuery = {
                _id: getAllById._id,
                username: getAllById.username,
                count: logByLimitQuery.length,
                log: logByLimitQuery,
            };
            return res.json(responByLimitQuery);
        }

        // if no queries exists
        const dateToStringWithNoQueries = await getAllById.log.map((log) => {
            return {
                description: log.description,
                duration: log.duration,
                date: new Date(log.date).toDateString(),
            };
        });

        const newResponWithNoQueries = {
            _id: getAllById._id,
            username: getAllById.username,
            count: getAllById.log.length,
            log: dateToStringWithNoQueries,
        };
        return res.json(newResponWithNoQueries);
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
