/** Spotify Adapter (stub) */
module.exports = {
  id: 'spotify',
  name: 'Spotify',
  category: 'entertainment',
  actions: {
    playTrack: async ({ trackId }) => {
      const { sleep } = require('../utils/sleep');
      await sleep(200);
      console.log(`[SpotifyAdapter] Playing track ${trackId}`);
      return { success: true };
    },
  },
  async getHealth() {
    return { status: 'healthy' };
  },
}; 