'use strict';
var User = require('../models/user');
var config = require('../config');
var jwt = require('jsonwebtoken');

module.exports = {
    createUser: function (name, password) {
        const userRec = new User({ name: name, email: email, password: password, admin: false });
        const user = userRec.save(function (err, user) {
            if (!err) {
                return user;
            }
        });
        return user;
    },
    changePwd: function (email, oldpassword, newpassword) {
        const user = User.update({ email: email, password: oldpassword }, { $set: { password: newpassword } }, function (err, user) {
            if (!err) {
                return user;
            }
        });
        return user;
    },
    getAllUsers: function () {
        const users = User.find({}, { _id: true, name: true, email: true}, function (err, users) {
            if (!err) {
                return users;
            }
        });
        return users;
    },
    getUser: function (email, password) {
        const user = User.find({ email: email, password: password }, function (err, users) {
            if (!err) {
                return users;
            }
        });
        return user;
    },
    verifyToken: function (token) {
        if (token) {
            const res = jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    return {
                        success: false,
                        message: 'Failed to authenticate token.'
                    };
                } else {
                    return {
                        success: true,
                        decoded: decoded
                    }
                }
            });
            return res;
        } else {
            return {
                success: false,
                message: 'No token provided.'
            };
        }
    }
}