/** Dropbox Adapter (stub) */
module.exports = {
  id: 'dropbox',
  name: 'Dropbox',
  category: 'storage',
  actions: {
    uploadFile: async ({ filename }) => {
      const { sleep } = require('../utils/sleep');
      await sleep(200);
      console.log(`[DropboxAdapter] Uploaded file ${filename}`);
      return { success: true };
    },
  },
  async getHealth() {
    return { status: 'healthy' };
  },
}; 