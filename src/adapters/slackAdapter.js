/** Slack Adapter (stub) */
module.exports = {
  id: 'slack',
  name: 'Slack',
  category: 'work',
  actions: {
    sendMessage: async ({ channel, text }) => {
      await new Promise((res) => setTimeout(res, 200));
      console.log(`[SlackAdapter] Sent message to ${channel}`);
      return { success: true, channel };
    },
  },
}; 