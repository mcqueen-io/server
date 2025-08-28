/** Microsoft Teams Adapter (stub) */
module.exports = {
  id: 'teams',
  name: 'Microsoft Teams',
  category: 'work',
  actions: {
    sendMessage: async ({ channel, text }) => {
      const { sleep } = require('../utils/sleep');
      await sleep(200);
      console.log(`[TeamsAdapter] Sent message to ${channel}`);
      return { success: true, channel };
    },
  },
  async getHealth() {
    return { status: 'healthy' };
  },
}; 