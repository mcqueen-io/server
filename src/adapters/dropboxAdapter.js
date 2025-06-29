/** Dropbox Adapter (stub) */
module.exports = {
  id: 'dropbox',
  name: 'Dropbox',
  category: 'storage',
  actions: {
    uploadFile: async ({ filename }) => {
      await new Promise((res) => setTimeout(res, 200));
      console.log(`[DropboxAdapter] Uploaded file ${filename}`);
      return { success: true };
    },
  },
}; 