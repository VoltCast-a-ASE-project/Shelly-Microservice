const ShellyDevice = require('../models/shelly');

exports.getShellyDevice = async(req,res)=>{
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: 'ID for ShellyDevice is required.' });
        }

        const shellyDevice = await ShellyDevice.getShellyDeviceByID(id);
        if(!shellyDevice){
            return res.status(404).json({ message: 'No ShellyDevice found with this ID.'});
        }

        res.status(200).json(shellyDevice);
    }catch (err) {
        console.log("Error getShellyDevice:",err);
        res.status(500).json({ message: `Cannot get ShellyDevice with ID ${id}.` });
    }
}

exports.getAllShellyDeviceByUser = async (req, res) => {
    try {
        const user = req.params.user;

        if (!user) {
            return res.status(400).json({message: 'User is required to retrieve Shelly Devices.'});
        }

        const shellyDevices = await ShellyDevice.getAllShellyDevicesByUser(user);

        res.status(200).json(shellyDevices);
    } catch (err) {
        console.error("Error getAllShellyDevicesByUser:", err);
        res.status(500).json({message: 'Cannot get ShellyDevices.'});
    }
};


exports.addShellyDevice = async (req, res) => {
    try {
        const {
            ip,
            name,
            user,
            internal_id
        } = req.body;

        const newShellyDevice = {
            ip: ip,
            name: name,
            user: user,
            internal_id: internal_id,
        };

        const newShellyDeviceID = await ShellyDevice.addShellyDevice(newShellyDevice);

        res.status(200).json({ message: 'Added ShellyDevice successfully.', id: newShellyDeviceID });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Cannot add ShellyDevice.' });
    }
};

exports.updateShellyDevice = async (req, res) => {
    try {
        const {
            id,
            ip,
            name,
            user,
            internal_id,
            isActivated,
        } = req.body;

        const updatedShellyDevice = {
            id: id,
            ip: ip,
            name: name,
            user: user,
            internal_id: internal_id,
            isActivated: isActivated,
        };

        const result = await ShellyDevice.updateShellyDevice(updatedShellyDevice);

        if (result) {
            res.status(200).json({ message: 'Updated ShellyDevice successfully.' });
        } else {
            res.status(400).json({ message: 'Cannot update ShellyDevice.' });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Cannot update ShellyDevice.' });
    }
};


exports.deleteShellyDevice = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await ShellyDevice.deleteShellyDevice(id);
        if (!result) {
            return res.status(404).json({ message: 'ShellyDevice not found.' });
        }

        res.status(200).json({ message: 'ShellyDevice deleted successfully.' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Cannot delete ShellyDevice.' });
    }
};
