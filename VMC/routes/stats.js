const express = require('express');

const { body, validationResult } = require('express-validator');

const router = express.Router();

const StatsController = require('../controllers/stats');

router.get('/stats/:id', StatsController.getShellyStats);

const switchValidator = [body('isActivated').isBoolean().withMessage('isActivated must be a boolean.')];

router.post('/switch/:id', switchValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, StatsController.setShellyIsActivatedStatus);

module.exports = router;