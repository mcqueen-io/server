/**
 * Gmail Adapter (stub for PoC)
 * In a production build this would use the Google APIs & OAuth 2.0.
 */

const sendEmail = async ({ to, subject, body }) => {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 200));
  console.log(`[GmailAdapter] Sent email to ${to} | subject: ${subject}`);
  return { success: true, to, subject };
};

module.exports = {
  id: 'gmail',
  name: 'Gmail',
  actions: {
    sendEmail,
  },
}; 