/** LinkedIn Adapter (stub) */
module.exports = {
  id: 'linkedin',
  name: 'LinkedIn',
  category: 'social',
  actions: {
    postUpdate: async ({ text }) => {
      const { sleep } = require('../utils/sleep');
      await sleep(200);
      console.log(`[LinkedInAdapter] Posted update: ${text}`);
      return { success: true };
    },
  },
  async getHealth() {
    return { status: 'healthy' };
  },
}; 