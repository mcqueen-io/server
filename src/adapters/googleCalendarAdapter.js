/** Google Calendar Adapter (stub) */
module.exports = {
  id: 'gcal',
  name: 'Google Calendar',
  category: 'work',
  actions: {
    createEvent: async ({ title, date }) => {
      const { sleep } = require('../utils/sleep');
      await sleep(200);
      console.log(`[GCalAdapter] Created event '${title}' on ${date}`);
      return { success: true };
    },
  },
  async getHealth() {
    return { status: 'healthy' };
  },
}; 