# MCP Server – Developer Notes

## 1. Quick Intro for Python Developers

| Concept (Python) | Equivalent (Node.js/Express) |
|------------------|------------------------------|
| `app = Flask(__name__)` | `const app = express();` |
| `@app.route('/path', methods=['POST'])` | `app.post('/path', (req,res)=>{})` |
| `pip install package` | `npm install package` |
| Virtualenv (`venv`)  | `node_modules` + optional `nvm` |
| `requirements.txt`   | `package.json` |
| `os.environ['KEY']`  | `process.env.KEY` (with **dotenv**) |

Node.js executes JavaScript (or TypeScript). Express is a minimalist web-framework, analogous to Flask. Mongoose plays the same ODM role as SQLAlchemy or Django ORM, but for MongoDB.

## 2. Code Walkthrough

```
src/
  index.js              → Entry point: sets up Express, connects Mongo, registers adapters.
  config/db.js          → Mongoose connection helper.
  core/toolRegistry.js  → In-memory registry: maps toolId ➜ adapter object.
  adapters/
    gmailAdapter.js     → First adapter (stub) exposing `sendEmail()`.
  routes/
    tools.js            → GET /api/tools       → list available tools.
    user.js             → POST /api/user/:id/send-email → sample task via Gmail.
```

### 2.1 Tool Registry
Used for discovery and invocation of adapters.
```js
const registry = require('core/toolRegistry');
registry.get('gmail').actions.sendEmail(opts);
```

### 2.2 Adding a New Adapter
1. Create `src/adapters/slackAdapter.js` exporting:
```js
module.exports = { id: 'slack', name: 'Slack', actions: { sendMessage } };
```
2. Register it in `src/index.js`:
```js
const slackAdapter = require('./adapters/slackAdapter');
registry.register(slackAdapter.id, slackAdapter);
```

### 2.3 Routes
You mount new routes in `src/index.js` using `app.use('/api/xyz', require('./routes/xyz'));`.

## 3. Environment Variables
`.env` (not committed) holds:
```
MONGODB_URI=<your connection string>
PORT=3000
```

## 4. Running
```
# install deps
npm install
# start dev server
npm start
```

Call sample endpoint:
```
POST http://localhost:3000/api/user/<userId>/send-email
{ "to": "test@example.com", "subject": "Hi", "body": "Hello from MCP" }
```

The console will log the simulated send.

## 5. Next Steps
* Flesh out OAuth handling per adapter.
* Persist user-tool tokens in MongoDB.
* Implement family & hybrid task routes.

## 6. OAuth Token Storage & Flow

We store OAuth **access / refresh tokens** in MongoDB (`tokens` collection):
```
{
  _id: ObjectId,
  userId: ObjectId,   // reference to Users
  toolId: 'gmail',    // adapter id
  accessToken: 'ya29...',
  refreshToken: '1//0g...',
  expiresAt: ISODate
}
```
Managed via `src/utils/tokenService.js`.

### Typical Connect Flow (per tool)
1. Mobile-app opens provider's OAuth URL.
2. User consents; provider redirects to MCP callback or returns `code`.
3. Mobile-app POSTs `{ code }` to `/api/user/{id}/connect/{toolId}`.
4. MCP exchanges `code` for tokens using provider API, then
   `saveToken({ userId, toolId, accessToken, refreshToken, expiresAt })`.
5. Subsequent requests by adapters fetch tokens with `getToken(userId, toolId)`.

### Getting Client IDs & Secrets
| Tool | Where to create app | Scopes to request |
|------|---------------------|-------------------|
| Gmail / Google Calendar / Drive | Google Cloud Console → OAuth consent + Credentials | `https://www.googleapis.com/auth/gmail.send`, `.../calendar`, `.../drive.file` |
| Slack | api.slack.com/apps → OAuth & Permissions | `chat:write`, `channels:read` |
| Microsoft Teams (Graph) | Azure Portal → App registrations | `Chat.ReadWrite`, `ChannelMessage.Send` |
| LinkedIn | developer.linkedin.com → My Apps | `w_member_social` |
| Spotify | developer.spotify.com → Dashboard | `user-modify-playback-state` |
| Dropbox | dropbox.com/developers/apps | `files.content.write` |

For each provider, save `client_id` and `client_secret` in `.env` or a secrets manager. 