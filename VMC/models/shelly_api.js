const useMock = process.env.MOCK_SHELLY_API === 'true';

module.exports = useMock
  ? require('./shelly_api.mock')
  : require('./shelly_api.real');