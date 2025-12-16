const express = require('express');

const { body, validationResult } = require('express-validator');

const router = express.Router();

const ShellyController = require('../controllers/shelly');

//validator for shellys on add and update
const validateShellyUpdate = [
    body('id').isNumeric().withMessage('id cannot be empty.'),
    body('ip').isString().isLength({ min: 1 }).withMessage('IP-address cannot be empty.'),
    body('user').isString().isLength({ min: 1 }).withMessage('user cannot be empty.'),
    body('internal_id').isNumeric().withMessage('internal_id cannot be empty.'),
    body('name').isString().isLength({ min: 1 }).withMessage('Name cannot be empty.'),
    body('isActivated').isBoolean().withMessage('isActivated must be a boolean.'),
];

const validateShellyAdd = [
    body('ip').isString().isLength({ min: 1 }).withMessage('IP-address cannot be empty.'),
    body('user').isString().isLength({ min: 1 }).withMessage('user cannot be empty.'),
    body('internal_id').isNumeric().withMessage('needs internal_id.'),
    body('name').isString().isLength({ min: 1 }).withMessage('Name cannot be empty.'),
];

// add a new Shelly
router.post('/add', validateShellyAdd, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, ShellyController.addShellyDevice);

// update a Shelly
router.put('/update', validateShellyUpdate, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, ShellyController.updateShellyDevice);

// get all Shellys by User
router.get('/user/:user', ShellyController.getAllShellyDeviceByUser);

// get one Shelly per id
router.get('/:id', ShellyController.getShellyDevice);

// delete a Shelly
router.delete('/:id', ShellyController.deleteShellyDevice);

module.exports = router;