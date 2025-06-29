const Token = require('../models/token');

async function saveToken({ userId, toolId, accessToken, refreshToken, expiresAt }) {
  return Token.findOneAndUpdate(
    { userId, toolId },
    { accessToken, refreshToken, expiresAt },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function getToken(userId, toolId) {
  return Token.findOne({ userId, toolId });
}

module.exports = { saveToken, getToken }; 