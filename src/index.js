require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require('./config/db');
const errorShape = require('./middleware/errorShape');

app.use(express.json());

// Only connect to DB during normal runtime, skip during tests
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

app.get('/health', (req, res) => {
  res.json({ status: 'MCP Server is running!' });
});

app.use('/api/tools', require('./routes/tools'));
app.use('/api/user', require('./routes/user'));
app.use('/api/family', require('./routes/family'));
app.use('/api/v1/mcp', require('./routes/mcp'));
app.use('/api/v1/mcp/auth', require('./routes/auth'));

// Error handler last
app.use(errorShape);

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

// Seed example schemas and confirmations
toolRegistry.setActionSchemas('gmail', {
  sendEmail: {
    type: 'object',
    required: ['to', 'subject', 'body'],
    properties: {
      to: { type: 'string', format: 'email' },
      subject: { type: 'string' },
      body: { type: 'string' },
    },
    additionalProperties: false,
  },
});
toolRegistry.setVoiceConfirmations('gmail', { sendEmail: ['to', 'subject'] });

toolRegistry.setActionSchemas('slack', {
  sendMessage: {
    type: 'object',
    required: ['channel', 'text'],
    properties: {
      channel: { type: 'string' },
      text: { type: 'string' },
    },
    additionalProperties: false,
  },
});

toolRegistry.setActionSchemas('teams', {
  sendMessage: {
    type: 'object',
    required: ['channel', 'text'],
    properties: {
      channel: { type: 'string' },
      text: { type: 'string' },
    },
    additionalProperties: false,
  },
});

toolRegistry.setActionSchemas('linkedin', {
  postUpdate: {
    type: 'object',
    required: ['text'],
    properties: {
      text: { type: 'string' },
    },
    additionalProperties: false,
  },
});

toolRegistry.setActionSchemas('spotify', {
  playTrack: {
    type: 'object',
    required: ['trackId'],
    properties: {
      trackId: { type: 'string' },
    },
    additionalProperties: false,
  },
});

toolRegistry.setActionSchemas('gdrive', {
  uploadFile: {
    type: 'object',
    required: ['filename'],
    properties: {
      filename: { type: 'string' },
    },
    additionalProperties: false,
  },
});

toolRegistry.setActionSchemas('dropbox', {
  uploadFile: {
    type: 'object',
    required: ['filename'],
    properties: {
      filename: { type: 'string' },
    },
    additionalProperties: false,
  },
});

toolRegistry.setActionSchemas('gcal', {
  createEvent: {
    type: 'object',
    required: ['title', 'date'],
    properties: {
      title: { type: 'string' },
      date: { type: 'string', format: 'date-time' },
    },
    additionalProperties: false,
  },
});

// Export app for testing; only listen when run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`MCP Server listening on port ${PORT}`);
  });
}

module.exports = app;