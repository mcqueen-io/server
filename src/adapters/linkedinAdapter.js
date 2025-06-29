/** LinkedIn Adapter (stub) */
module.exports = {
  id: 'linkedin',
  name: 'LinkedIn',
  category: 'social',
  actions: {
    postUpdate: async ({ text }) => {
      await new Promise((res) => setTimeout(res, 200));
      console.log(`[LinkedInAdapter] Posted update: ${text}`);
      return { success: true };
    },
  },
}; 