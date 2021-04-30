const mongoose = require('mongoose');
const Password = require('./models/password');
const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');
const { encrypt, decrypt } = require('./crypto');
mongoose.Promise = global.Promise;
const db = mongoose.connect('mongodb://localhost/pwd-mng-cli', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

clear();

console.log(
    chalk.cyan(
        figlet.textSync('Pwd-mng-cli', {horizontalLayout: 'fit'})
    )  
);

//add Password
const addPassword = (passwordin) => {
    const hash = encrypt(passwordin.password);
    const passwordObj = {
        application: String,
        username: String,
        password: String,
        iv: String
    }
    passwordObj.application = passwordin.application;
    passwordObj.username = passwordin.username;
    passwordObj.password = hash.content.toString();
    passwordObj.iv = hash.iv.toString();
    Password.create(passwordObj) 
        .then(passwordObj => {
            console.info('New Password added!');
            mongoose.connection.close();
        });
}

//find Password
const findPassword = (application) => {
    const search = new RegExp(application, 'i');
    Password.find({$or: [{application: search}]})
        .then(password => {
            console.info(password);
            mongoose.connection.close();
        })
}

//update password
const updatePassword = (_id, password) => {
    Password.updateOne({_id}, password)
        .then(password => {
            console.info('Password updated!');
            mongoose.connection.close();
        });
}

//remove password
const removePassword = (_id) => {
    Password.deleteOne({_id})
        .then(password => {
            console.info('Password deleted!');
            mongoose.connection.close();
        });
}

//list all password
const listPasswords = () => {
    Password.find()
        .then(password => {
            console.info(password);
            console.info(`${password.length} Passwords!`);
            mongoose.connection.close();
        });
}

module.exports = {
    addPassword,
    findPassword,
    updatePassword,
    removePassword,
    listPasswords
}