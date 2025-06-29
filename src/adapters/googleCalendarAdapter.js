/** Google Calendar Adapter (stub) */
module.exports = {
  id: 'gcal',
  name: 'Google Calendar',
  category: 'work',
  actions: {
    createEvent: async ({ title, date }) => {
      await new Promise((res) => setTimeout(res, 200));
      console.log(`[GCalAdapter] Created event '${title}' on ${date}`);
      return { success: true };
    },
  },
}; 