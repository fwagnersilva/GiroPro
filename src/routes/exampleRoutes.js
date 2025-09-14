const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler');
const router = express.Router();

router.get('/example-error', asyncHandler(async (req, res, next) => {
    throw new Error('This is an example error!');
}));

router.get('/example-success', asyncHandler(async (req, res, next) => {
    res.status(200).json({ message: 'Success!' });
}));

module.exports = router;

