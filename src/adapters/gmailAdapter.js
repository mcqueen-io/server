/**
 * Gmail Adapter (stub for PoC)
 * In a production build this would use the Google APIs & OAuth 2.0.
 */

const { sleep } = require('../utils/sleep');

const sendEmail = async ({ to, subject, body }) => {
  // Simulate network delay
  await sleep(200);
  console.log(`[GmailAdapter] Sent email to ${to} | subject: ${subject}`);
  return { success: true, to, subject };
};

module.exports = {
  id: 'gmail',
  name: 'Gmail',
  actions: {
    sendEmail,
  },
  async getHealth() {
    return { status: 'healthy' };
  },
}; 