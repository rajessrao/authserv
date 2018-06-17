'use strict';

var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('../config');
var userService = require('../services/UsersService');
var log = require('../utils/Logger');

let router = express.Router();
let sampleError = {
    type: 'ErrorType',
    message: 'Error occured',
    messageCode: 1052 // Optional message code (numeric)
};

router.post('/authenticate', function (req, res) {
    try {
        var promise = userService.getUser(req.body.name, req.body.password);

        promise.then(function (data) {
            var token = jwt.sign({ admin: data.admin }, config.secret, {
                expiresIn: 1440 // expires in 24 hours
            });
            data = {
                success: true,
                message: 'Enjoy your token!',
                token: token
            };
            res.status(200).send(data);
        });

        promise.catch(function (error) {
            log.error('Failed')
            res.status(500).send(sampleError);
        });
    } catch (e) {
        log.error('Route /users/ failed with error', e);
        res.status(500).send(sampleError);
    }
});

router.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

router.get('/', function (req, res) {
    try {
        var promise = userService.getAllUsers();

        promise.then(function (data) {
            // Do something (if required) with the data, then send it to the client
            res.status(200).send(data);
        });

        promise.catch(function (error) {
            // Never send stack traces to the client.
            log.error('Failed')
            res.status(500).send(sampleError);
        });
    } catch (e) {
        // Use a good logging framework for logging to file
        log.error('Route /users/ failed with error', e);
        res.status(500).send(sampleError);
    }
});

router.post('/user', function (req, res) {
    // This route needs to be ordered before /:postId since express will match '/post' to be path param as well
    var promise;
    try {
        promise = userService.getUser(req.body.name, req.body.password);

        promise.then(function (data) {
            // Do something (if required) with the data, then send it to the client
            res.status(200).send(data);
        });

        promise.catch(function (error) {
            // Never send stack traces to the client.
            res.status(500).send(sampleError);
        });
    } catch (e) {
        // Use a good logging framework for logging to file
        res.status(500).send(sampleError);
    }
});

module.exports = router;