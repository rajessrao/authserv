'use strict';
var User = require('../models/user');

module.exports = {
    createUser: function (name, password) {
        let userRec = new User({ name: name, password: password, admin: false });
        userRec.save(function (err, user) {
            if (!err) {
                return user;
            }
        });
    },
    getAllUsers: function () {
        let users = User.find({}, function (err, users) {
            return users;
        });
        return users;
    },
    getUser: function (name, password) {
        let user = User.find({ name: name, password: password }, function (err, users) {
            return users;
        });
        return user;
    }
}