const db = require('../../database/database');

module.exports = class ShellyDevice{
    constructor(data){
        this.id = data.id || null;
        this.ip = data.ip;
        this.user = data.user;
        this.internal_id = data.internal_id;
        this.name = data.name;
        this.isActivated = data.isActivated;
    }

    /**
        get a shelly by id from the DB and parse into a ShellyDevice Object
    */
    static async getShellyDeviceByID(shellyID) {
        try {
            const result = await db.query(
                'SELECT * FROM shelly WHERE id=?',
                [shellyID]
            );

            if(result.rows.length>0){
                const row = result.rows[0];

                return new ShellyDevice({
                    id: row.id,
                    ip: row.ip,
                    user: row.user,
                    internal_id: row.internal_id,
                    name: row.name,
                    isActivated: row.isActivated,
                });

            }else{
                console.log('No such shelly found.');
                return null;
            }
        } catch (error) {
            throw error;
        }
    }

    /**
        get all shellys for a user and map them into an array of ShellyDevices
    */
    static async getAllShellyDevicesByUser(user) {
        try {
            const result = await db.query(
                'SELECT * FROM shelly WHERE `user` = ?',
                [user]
            );

            const shellys = [];

            for (const row of result.rows) {
                shellys.push(new ShellyDevice({
                    id: row.id,
                    ip: row.ip,
                    user: row.user,
                    internal_id: row.internal_id,
                    name: row.name,
                    isActivated: row.isActivated,
                }));
            }

            return shellys;
        } catch (error) {
            throw error;
        }
    }


    /**
        add new Shelly to DB
    */
    static async addShellyDevice(shellyDevice){
        try{
            const result = await db.query(
                'INSERT INTO shelly (name, ip, user,internal_id) VALUES ( ?, ?,?,?);',
                [shellyDevice.name, shellyDevice.ip,shellyDevice.user, shellyDevice.internal_id],
            );
            return result.lastID;
        }catch (error) {
            throw error;
        }
    }

    /**
        update the isActivated status of the Shelly in the DB (true, false)
    */
    static async updateShellyDeviceActivationStatus(shellyDevice) {
        try{
            const result = await db.query(
                'UPDATE shelly SET isActivated = ? WHERE id = ?;',
                [shellyDevice.isActivated, shellyDevice.id]
            );
            return result.changes>0;
        }catch (error) {
            throw error;
        }
    }

    /**
        update Shelly in the DB with full description of shelly from the frontend
    */
    static async updateShellyDevice(shellyDevice){
        try{
            const result = await db.query(
                'UPDATE shelly SET ip = ?, name = ?,user = ?, isActivated = ?, internal_id = ? WHERE id = ?;',
                [shellyDevice.ip, shellyDevice.name, shellyDevice.user, shellyDevice.isActivated, shellyDevice.internal_id, shellyDevice.id]
            );
            return result.changes>0
        }catch (error) {
            throw error;
        }
    }


    /**
        delete Shelly from DB
    */
    static async deleteShellyDevice(id){
        try{
            const result = await db.query(
                'DELETE FROM shelly WHERE id = ?',
                [id]
            );
            return result.changes>0;
        }
        catch (error){
            throw error;
        }
    }
}