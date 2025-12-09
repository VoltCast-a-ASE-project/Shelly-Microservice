module.exports = {
    query: jest.fn(),
    testDatabase: jest.fn().mockResolvedValue(true)
};
