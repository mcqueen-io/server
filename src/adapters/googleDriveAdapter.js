/** Google Drive Adapter (stub) */
module.exports = {
  id: 'gdrive',
  name: 'Google Drive',
  category: 'storage',
  actions: {
    uploadFile: async ({ filename }) => {
      await new Promise((res) => setTimeout(res, 200));
      console.log(`[DriveAdapter] Uploaded file ${filename}`);
      return { success: true };
    },
  },
}; 