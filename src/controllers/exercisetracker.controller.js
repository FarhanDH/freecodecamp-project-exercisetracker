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

/**
 * Retrieves user details by ID with optional query parameters.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Object} The JSON containing user details also based queries if exists.
 */
const getDetailById = async (req, res) => {
    // Get the _id parameter from the request
    const { _id } = req.params;
    // Get the from, to, and limit query parameters from the request
    const { from, to, limit } = req.query;

    try {
        // Find the user exercise by its _id
        const userExercise = await UserExercise.findById(_id);

        // Helper function to format the date
        const formatDate = (date) => new Date(date).toDateString();

        // Initialize the log filter with all the logs
        let logFilter = userExercise.log;

        // Apply filters based on the from and to parameters
        if (from && to) {
            // Convert the to date to the next day
            const toDate = new Date(to);
            toDate.setDate(toDate.getDate() + 1);
            // Filter the logs based on the from and to dates
            logFilter = logFilter.filter(
                (log) =>
                    new Date(log.date).getTime() < toDate.getTime() &&
                    new Date(log.date).getTime() >= new Date(from).getTime()
            );
        } else if (from) {
            // Filter the logs based on the from date
            logFilter = logFilter.filter(
                (log) =>
                    new Date(log.date).getTime() >= new Date(from).getTime()
            );
        } else if (to) {
            // Convert the to date to the next day
            const toDate = new Date(to);
            toDate.setDate(toDate.getDate() + 1);
            // Filter the logs based on the to date
            logFilter = logFilter.filter(
                (log) => new Date(log.date).getTime() < toDate.getTime()
            );
        }

        // Map the filtered logs to the desired format
        let logResult = logFilter.map((log) => ({
            description: log.description,
            duration: log.duration,
            date: formatDate(log.date),
        }));

        // Apply the limit if specified
        if (limit) {
            logResult = logResult.splice(0, Number(limit));
        }

        // Construct the response object
        const response = {
            _id: userExercise._id,
            username: userExercise.username,
            from: from ? formatDate(from) : undefined,
            to: to ? formatDate(to) : undefined,
            count: logResult.length,
            log: logResult,
        };

        // Send the response as JSON
        return res.json(response);
    } catch (error) {
        // Send an error message as JSON if an error occurs
        return res.json({
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
