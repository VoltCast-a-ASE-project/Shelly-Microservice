const express = require('express');

const { body, validationResult } = require('express-validator');

const router = express.Router();

const ShellyController = require('../controllers/shelly');

const validateShelly = [
    body('id').isNumeric().optional(),
    body('ip').isString().isLength({ min: 1 }).withMessage('IP-address cannot be empty.'),
    body('user').isString().isLength({ min: 1 }).withMessage('user cannot be empty.'),
    body('internal_id').isNumeric().withMessage('needs internal_id.'),
    body('name').isString().isLength({ min: 1 }).withMessage('Name cannot be empty.'),
    body('isActivated').isBoolean().withMessage('isActivated must be a boolean.'),
];

router.post('/add', validateShelly, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, ShellyController.addShellyDevice);

router.put('/update', validateShelly, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, ShellyController.updateShellyDevice);


router.get('/:id', ShellyController.getShellyDevice);

router.delete('/:id', ShellyController.deleteShellyDevice);

module.exports = router;