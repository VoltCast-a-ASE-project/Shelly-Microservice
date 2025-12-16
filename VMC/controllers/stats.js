const Stats = require('../models/stats');

/**
    retrieves the stats for a Shelly Device with the help of the stats model that sends request to the plug and handles responses
*/
exports.getShellyStats = async(req,res)=>{
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: 'ID for ShellyDevice is required.' });
        }

        const stats = await Stats.getShellyStats(id);
        if(stats === null){
            return res.status(404).json({ message: 'No ShellyDevice found with this ID.'});
        }

        res.status(200).json(stats);
    }catch (err) {
        console.log("Error getShellyStats:",err);
        res.status(500).json({ message: `Cannot get ShellyStats with ID ${id}.` });
    }
}

/**
    handles the switching on and off for a Shelly
*/
exports.setShellyIsActivatedStatus = async(req,res)=>{
    try {
        const id = req.params.id;
        const { isActivated } = req.body;

        const success = await Stats.setSwitchById(id, isActivated);

        if (success) {
            return res.status(200).json({ message: 'Shelly switch updated successfully.' });
        } else {
            return res.status(404).json({ message: 'ShellyDevice not found.' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Cannot update Shelly switch.' });
    }
}