/** Spotify Adapter (stub) */
module.exports = {
  id: 'spotify',
  name: 'Spotify',
  category: 'entertainment',
  actions: {
    playTrack: async ({ trackId }) => {
      await new Promise((res) => setTimeout(res, 200));
      console.log(`[SpotifyAdapter] Playing track ${trackId}`);
      return { success: true };
    },
  },
}; 