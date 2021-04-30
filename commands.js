#!/bin/env node

const program = require('commander');
const { prompt } = require('inquirer');
const {
    addPassword,
    findPassword,
    updatePassword,
    removePassword,
    listPasswords
} = require('./index');

const questions = [
    {
        type: 'input',
        name: 'application',
        message: 'Application: '
    },
    {
        type: 'input',
        name: 'username',
        message: 'Username: '
    },
    {
        type: 'password',
        name: 'password',
        message: 'Password: '
    }
]

//version
program
    .version('1.0.0')
    .alias('v')
    .description('Password management system')

//add
program
    .command('add')
    .alias('a')
    .description('Add a new password')
    .action(() => {
        prompt(questions)
            .then(answer => addPassword(answer));
    });

//find
program
    .command('find <name>')
    .alias('f')
    .description('Find a password')
    .action(name => findPassword(name));

//update
program
    .command('update <_id>')
    .alias('u')
    .description('Update a Password')
    .action(_id => {
        prompt(questions)
            .then(answer => updatePassword(_id, answer));
    });

//delete
program 
    .command('delete <_id>')
    .alias('d')
    .description('Delete a Password')
    .action(_id => removePassword(_id));

//list
program
    .command('list')
    .alias('l')
    .description('List all the Passwords')
    .action(() => listPasswords());

program.parse(process.argv);