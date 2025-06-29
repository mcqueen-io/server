/** Microsoft Teams Adapter (stub) */
module.exports = {
  id: 'teams',
  name: 'Microsoft Teams',
  category: 'work',
  actions: {
    sendMessage: async ({ channel, text }) => {
      await new Promise((res) => setTimeout(res, 200));
      console.log(`[TeamsAdapter] Sent message to ${channel}`);
      return { success: true, channel };
    },
  },
}; 