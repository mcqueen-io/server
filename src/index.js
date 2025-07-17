require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require('./config/db');

app.use(express.json());


async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`MCP Server listening on port ${PORT}`);
  });
}

app.get('/health', (req, res) => {
  res.json({ status: 'MCP Server is running!' });
});

app.use('/api/tools', require('./routes/tools'));
app.use('/api/user', require('./routes/user'));
app.use('/api/family', require('./routes/family'));

const toolRegistry = require('./core/toolRegistry');
const gmailAdapter = require('./adapters/gmailAdapter');
const slackAdapter = require('./adapters/slackAdapter');
const teamsAdapter = require('./adapters/teamsAdapter');
const linkedinAdapter = require('./adapters/linkedinAdapter');
const spotifyAdapter = require('./adapters/spotifyAdapter');
const gdriveAdapter = require('./adapters/googleDriveAdapter');
const dropboxAdapter = require('./adapters/dropboxAdapter');
const gcalAdapter = require('./adapters/googleCalendarAdapter');

toolRegistry.register(gmailAdapter.id, gmailAdapter);
toolRegistry.register(slackAdapter.id, slackAdapter);
toolRegistry.register(teamsAdapter.id, teamsAdapter);
toolRegistry.register(linkedinAdapter.id, linkedinAdapter);
toolRegistry.register(spotifyAdapter.id, spotifyAdapter);
toolRegistry.register(gdriveAdapter.id, gdriveAdapter);
toolRegistry.register(dropboxAdapter.id, dropboxAdapter);
toolRegistry.register(gcalAdapter.id, gcalAdapter);

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});