/** Google Drive Adapter (stub) */
module.exports = {
  id: 'gdrive',
  name: 'Google Drive',
  category: 'storage',
  actions: {
    uploadFile: async ({ filename }) => {
      const { sleep } = require('../utils/sleep');
      await sleep(200);
      console.log(`[DriveAdapter] Uploaded file ${filename}`);
      return { success: true };
    },
  },
  async getHealth() {
    return { status: 'healthy' };
  },
}; 