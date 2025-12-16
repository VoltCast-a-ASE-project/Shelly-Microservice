const Stats = require('../models/stats');

/**
    retrieves the stats for a Shelly Device with the help of the stats model that sends request to the plug and handles responses
*/
exports.getShellyStats = async(req,res)=>{
    try {
        const id = req.params.id;

        if (!id) {
            console.log("getShellyStats request unsuccessful: No ID given.");
            return res.status(400).json({ message: 'ID for ShellyDevice is required.' });
        }

        const stats = await Stats.getShellyStats(id);
        if(stats === null){
            console.log("getShellyStats request unsuccessful: No ShellyDevice found with this ID.");
            return res.status(404).json({ message: 'No ShellyDevice found with this ID.'});
        }
        console.log("getShellyStats request successful: Returning Shelly Stats.");
        res.status(200).json(stats);
    }catch (err) {
        console.log("getShellyStats request unsuccessful: Internal Error.");
        console.log(err);
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
            console.log("setShellyIsActivatedStatus request successful: Switched plug.");
            return res.status(200).json({ message: 'Shelly switch updated successfully.' });
        } else {
            console.log("setShellyIsActivatedStatus request unsuccessful: Cannot switched plug.");
            return res.status(404).json({ message: 'ShellyDevice not found.' });
        }

    } catch (err) {
        console.log("setShellyIsActivatedStatus request unsuccessful: Internal Error.");
        console.log(err);
        res.status(500).json({ message: 'Cannot update Shelly switch.' });
    }
}