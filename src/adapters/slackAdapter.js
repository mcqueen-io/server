/** Slack Adapter (stub) */
module.exports = {
  id: 'slack',
  name: 'Slack',
  category: 'work',
  actions: {
    sendMessage: async ({ channel, text }) => {
      const { sleep } = require('../utils/sleep');
      await sleep(200);
      console.log(`[SlackAdapter] Sent message to ${channel}`);
      return { success: true, channel };
    },
  },
  async getHealth() {
    return { status: 'healthy' };
  },
}; 