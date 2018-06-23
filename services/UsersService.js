'use strict';
var User = require('../models/user');

module.exports = {
    createUser: function (name, password) {
        let userRec = new User({ name: name, email: email, password: password, admin: false });
        userRec.save(function (err, user) {
            if (!err) {
                return user;
            }
        });
    },
    changePwd: function (email, oldpassword, newpassword) {
        User.update({ email: email, password: oldpassword }, { $set: { password: newpassword }}, function (err, user) {
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
    getUser: function (email, password) {
        let user = User.find({ email: email, password: password }, function (err, users) {
            return users;
        });
        return user;
    }
}