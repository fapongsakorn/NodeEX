const express = require('express');
const router = express.Router();
const userSchema = require('../models/users.model');

router.get('/api/v1/approve', async function (req, res, next) {
    try {
        // Find users with role 'user' and status 0
        let users = await userSchema.find({ role: 'user', status: 0 });
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

router.put('/api/v1/approve/:id', async function (req, res, next) {
    try {
        const id = req.params.id;

        // Assuming your model has a 'status' field
        await userSchema.findByIdAndUpdate(id, { status: 1 });

        res.status(200).send("Resource updated successfully.");
    } catch (error) {
        console.error(error);
        res.status(500).send(error.toString());
    }
});

module.exports = router;
