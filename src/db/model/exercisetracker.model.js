const mongoose = require('mongoose');
const { Schema } = mongoose;

const logSchema = new Schema({
    description: String,
    duration: Number,
    date: { type: Date, default: new Date().toDateString() },
});

const userSchema = new Schema({
    username: { type: String, required: true },
    count: { type: Number, default: 0 },
    log: [logSchema],
});

const UserExercise = mongoose.model('UserExercise', userSchema);

module.exports = UserExercise;
