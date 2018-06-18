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

/**
 * @swagger
 * /authenticate:
 *   post:
 *     summary: Authenticate the user
 *     description: Returns the token
 *     tags:
 *       - Authenticate
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: name of the user to fetch
 *         in: body
 *         required: true
 *         type: string
 *         example: rajesh
 *       - name: password
 *         description: password of the user to fetch
 *         in: body
 *         required: true
 *         type: string
 *         example: rajesh
 *     responses:
 *       200:
 *         description: Successful
 *       500:
 *         description: Server Error
 */
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

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Returns all users with details
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful
 *       500:
 *         description: Server Error
 */
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

module.exports = router;