'use strict';
var User = require('../models/user');

module.exports = {
    getAllUsers: function () {
        let users = User.find({}, function (err, users) {
            return users;
        })
        return users;
    },
    getUser: function (name, password) {
        let user = User.find({ name: name, password: password }, function (err, users) {
            return user;
        })
        return user;
    }
}