const ShellyDevice = require('../VMC/models/shelly');
const db = require('../database/database');

jest.mock('../database/database', () => ({
    testDatabase: jest.fn().mockResolvedValue(true),
    query: jest.fn(),
}));


describe('ShellyDevice Model', () => {

    afterEach(()=>jest.clearAllMocks());

    it('getShellyDeviceByID returns device', async () => {
        db.query.mockResolvedValue({rows:[{id:1, ip:'1.1.1.1', user:'u', internal_id:0, name:'A', isActivated:0}]});
        const device = await ShellyDevice.getShellyDeviceByID(1);
        expect(device).toBeInstanceOf(ShellyDevice);
        expect(device.name).toBe('A');
    });

    it('getShellyDeviceByID returns null if not found', async ()=>{
        db.query.mockResolvedValue({rows:[]});
        const device = await ShellyDevice.getShellyDeviceByID(99);
        expect(device).toBeNull();
    });

    it('getShellyDeviceByID throws on DB error', async ()=>{
        db.query.mockRejectedValue(new Error('DB fail'));
        await expect(ShellyDevice.getShellyDeviceByID(1)).rejects.toThrow('DB fail');
    });

    it('getAllShellyDevicesByUser returns array', async ()=>{
        db.query.mockResolvedValue({
            rows:[
                {id:1, ip:'1', user:'u', internal_id:0, name:'A', isActivated:0},
                {id:2, ip:'2', user:'u', internal_id:1, name:'B', isActivated:1}
            ]
        });
        const result = await ShellyDevice.getAllShellyDevicesByUser('u');
        expect(result.length).toBe(2);
        expect(result[0]).toBeInstanceOf(ShellyDevice);
    });

    it('getAllShellyDevicesByUser throws on DB error', async () => {
        db.query.mockRejectedValue(new Error('fail'));
        await expect(ShellyDevice.getAllShellyDevicesByUser('u')).rejects.toThrow('fail');
    });

    it('addShellyDevice returns new ID', async ()=>{
        db.query.mockResolvedValue({lastID:5});
        const id = await ShellyDevice.addShellyDevice({name:'A', ip:'1', user:'u', internal_id:0});
        expect(id).toBe(5);
    });

    it('addShellyDevice logs error on DB fail', async ()=>{
        db.query.mockRejectedValue(new Error('fail'));
        await expect(ShellyDevice.addShellyDevice({name:'A'})).rejects.toThrow('fail');
    });

    it('updateShellyDevice returns true on success', async ()=>{
        db.query.mockResolvedValue({changes:1});
        const res = await ShellyDevice.updateShellyDevice({id:1});
        expect(res).toBe(true);
    });

    it('updateShellyDevice returns false on no changes', async ()=>{
        db.query.mockResolvedValue({changes:0});
        const res = await ShellyDevice.updateShellyDevice({id:1});
        expect(res).toBe(false);
    });

    it('updateShellyDevice throws on DB fail', async () => {
        db.query.mockRejectedValue(new Error('fail'));
        await expect(ShellyDevice.updateShellyDevice({id:1})).rejects.toThrow('fail');
    });

    it('updateShellyDeviceActivationStatus returns true', async ()=>{
        db.query.mockResolvedValue({changes:1});
        const res = await ShellyDevice.updateShellyDeviceActivationStatus({id:1,isActivated:0});
        expect(res).toBe(true);
    });

    it('updateShellyDeviceActivationStatus returns false', async ()=>{
        db.query.mockResolvedValue({changes:0});
        const res = await ShellyDevice.updateShellyDeviceActivationStatus({id:1,isActivated:0});
        expect(res).toBe(false);
    });

    it('updateShellyDeviceActivationStatus throws on DB fail', async () => {
        db.query.mockRejectedValue(new Error('fail'));
        await expect(ShellyDevice.updateShellyDeviceActivationStatus({id:1,isActivated:0})).rejects.toThrow('fail');
    });

    it('deleteShellyDevice returns true', async ()=>{
        db.query.mockResolvedValue({changes:1});
        const res = await ShellyDevice.deleteShellyDevice(1);
        expect(res).toBe(true);
    });

    it('deleteShellyDevice returns false', async ()=>{
        db.query.mockResolvedValue({changes:0});
        const res = await ShellyDevice.deleteShellyDevice(99);
        expect(res).toBe(false);
    });

    it('deleteShellyDevice throws on DB fail', async () => {
        db.query.mockRejectedValue(new Error('fail'));
        await expect(ShellyDevice.deleteShellyDevice(1)).rejects.toThrow('fail');
    });
});