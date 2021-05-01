const mongoose = require('mongoose');

const passwordSchema = mongoose.Schema({
    application: {type: String},
    email: {type: String},
    username: {type: String},
    password: {type: String},
    iv: {type: String}
});

module.exports = mongoose.model('password', passwordSchema);