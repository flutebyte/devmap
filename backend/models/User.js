const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        trim: true
    },
    email:{
        type: String,
        unique: true,
        trim: true
    },
    password: String
},{timestamps: true});

const User = mongoose.model('User', UserSchema);

module.exports = User;