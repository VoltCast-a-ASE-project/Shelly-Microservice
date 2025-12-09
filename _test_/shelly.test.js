const ShellyDevice = require('../VMC/models/shelly');
const db = require('../database/database');

jest.mock('../database/database', () => ({
    testDatabase: jest.fn().mockResolvedValue(true),
    query: jest.fn(),
}));


describe('ShellyDevice', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get ShellyDevice by ID', async () => {
        db.query.mockResolvedValue({
            rows: [{
                id: 1,
                ip: '192.168.1.10',
                name: 'Shelly Plug A',
                user: 'testUser',
                internal_id: 0,
                isActivated: 0
            }]
        });

        const device = await ShellyDevice.getShellyDeviceByID(1);
        expect(device).toBeInstanceOf(ShellyDevice);
        expect(device.name).toBe('Shelly Plug A');
    });

    it('should return null if ID not found', async () => {
        db.query.mockResolvedValue({ rows: [] });
        const device = await ShellyDevice.getShellyDeviceByID(999);
        expect(device).toBeNull();
    });

    it('should add a new ShellyDevice', async () => {
        db.query.mockResolvedValue({ lastID: 1 });

        const newDevice = {
            ip: '192.168.1.10',
            name: 'Shelly Plug A',
            user: 'testUser',
            internal_id: 0
        };

        const id = await ShellyDevice.addShellyDevice(newDevice);

        expect(id).toBe(1);
        expect(db.query).toHaveBeenCalledWith(
            'INSERT INTO shelly (name, ip, user,internal_id) VALUES ( ?, ?,?,?);',
            ['Shelly Plug A','192.168.1.10','testUser',0]
        );
    });

    it('should update a ShellyDevice', async () => {
        db.query.mockResolvedValue({changes:1 });

        const updatedDevice = {
            id: 2,
            ip: '192.168.1.10',
            name: 'Shelly Plug A',
            user: 'testUser',
            internal_id: 0,
            isActivated: 0
        };

        const result = await ShellyDevice.updateShellyDevice(updatedDevice);

        expect(result).toBe(true);
        expect(db.query).toHaveBeenCalledWith(
            'UPDATE shelly SET ip = ?, name = ?,user = ?, isActivated = ?, internal_id = ? WHERE id = ?;',
            ['192.168.1.10','Shelly Plug A','testUser',0,0,2]
        );
    });

    it('should update a ShellyDevice', async () => {
        db.query.mockResolvedValue({changes:1 });

        const updatedDevice = {
            id: 2,
            ip: '192.168.1.10',
            name: 'Shelly Plug A',
            user: 'testUser',
            internal_id: 0,
            isActivated: 0
        };

        const result = await ShellyDevice.updateShellyDevice(updatedDevice);

        expect(result).toBe(true);
        expect(db.query).toHaveBeenCalledWith(
            'UPDATE shelly SET ip = ?, name = ?,user = ?, isActivated = ?, internal_id = ? WHERE id = ?;',
            ['192.168.1.10','Shelly Plug A','testUser',0,0,2]
        );
    });

    it('should update the isActive status of a ShellyDevice', async () => {
        db.query.mockResolvedValue({changes:1 });

        const updatedDevice = {
            id: 2,
            ip: '192.168.1.10',
            name: 'Shelly Plug A',
            user: 'testUser',
            internal_id: 0,
            isActivated: 0
        };

        const result = await ShellyDevice.updateShellyDeviceActivationStatus(updatedDevice);

        expect(result).toBe(true);
        expect(db.query).toHaveBeenCalledWith(
            'UPDATE shelly SET isActivated = ? WHERE id = ?;',
            [0,2]
        );
    });

    it('should delete ShellyDevice', async () => {
        db.query.mockResolvedValue({ changes: 1 });
        const deleted = await ShellyDevice.deleteShellyDevice(1);
        expect(deleted).toBe(true);
    });
});
