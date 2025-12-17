const useMock = process.env.MOCK_SHELLY_API === 'true';

module.exports = useMock
  ? require('./shellyApi.mock')
  : require('./shellyApi.real');