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
    chalk.cyan('Password Manager:-')
);

//add Password
const addPassword = (passwordin) => {
    const search = new RegExp(passwordin.application, 'i');
    Password.find({$or: [{application: search}]})
        .then(password => {
            if (password.length == 0) {
                const hash = encrypt(passwordin.password);
                var passwordObj = {
                    _id: String,
                    application: String,
                    email: String,
                    username: String,
                    password: String,
                    iv: String
                }
                passwordObj._id = passwordin.application;
                passwordObj.application = passwordin.application;
                passwordObj.email = passwordin.email;
                passwordObj.username = passwordin.username;
                passwordObj.password = hash.content.toString();
                passwordObj.iv = hash.iv.toString();
                Password.create(passwordObj) 
                    .then(passwordObj => {
                        console.info('New Password added!');
                        mongoose.connection.close();
                    });
            }
            else {
                console.info(chalk.red("Application already exist!"));
                mongoose.connection.close();
            }
        });
}

//find Password
const findPassword = (application) => {
    const hash = {
        iv: String,
        content: String
    };
    const search = new RegExp(application, 'i');
    Password.find({$or: [{application: search}]})
        .then(password => {
            hash.iv = password[0].iv;
            hash.content = password[0].password;
            const text = decrypt(hash);
            console.info("\t" + chalk.green(password[0].application + ":-"));
            console.info("\t  email-id: " + password[0].email);
            console.info("\t  username: " + password[0].username);
            console.info("\t  password: " + text + "\n");
            mongoose.connection.close();
        });
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
    var hash = {
        iv: String,
        content: String
    };
    Password.find()
        .then(password => {
            for (var i = 0; i < password.length; i++) {
                hash.iv = password[i].iv;
                hash.content = password[i].password;
                const text = decrypt(hash);
                console.info("\t" + chalk.green(password[i].application + ":-"));
                console.info("\t  email-id: " + password[i].email);
                console.info("\t  username: " + password[i].username);
                console.info("\t  password: " + text + "\n");
            }
            console.info(chalk.yellow(password.length + " Applications found!"));
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