class ToolRegistry {
  constructor() {
    this.tools = new Map();
    this.voiceConfirmations = new Map(); // toolId -> { [action]: string[] }
    this.actionSchemas = new Map(); // toolId -> { [action]: JSONSchema }
  }

  /**
   * Register a tool adapter once during boot.
   * @param {string} toolId unique id (e.g., "gmail")
   * @param {object} adapter adapter object exposing actions
   */
  register(toolId, adapter) {
    if (this.tools.has(toolId)) {
      throw new Error(`Tool '${toolId}' already registered`);
    }
    this.tools.set(toolId, adapter);
    if (adapter && adapter.voiceConfirmations) {
      this.setVoiceConfirmations(toolId, adapter.voiceConfirmations);
    }
  }

  /**
   * Retrieve an adapter.
   * @param {string} toolId
   */
  get(toolId) {
    return this.tools.get(toolId);
  }

  /**
   * List registered tool metadata for discovery endpoints.
   */
  list() {
    return Array.from(this.tools.values()).map((tool) => ({ id: tool.id, name: tool.name, category: tool.category || 'uncategorized' }));
  }

  /**
   * Configure required voice confirmations per tool action
   * @param {string} toolId
   * @param {Record<string,string[]>} mapping action -> required field names
   */
  setVoiceConfirmations(toolId, mapping) {
    this.voiceConfirmations.set(toolId, { ...(this.voiceConfirmations.get(toolId) || {}), ...mapping });
  }

  /**
   * Get required fields for a tool action
   * @param {string} toolId
   * @param {string} action
   * @returns {string[]}
   */
  getVoiceConfirmations(toolId, action) {
    const byTool = this.voiceConfirmations.get(toolId) || {};
    return byTool[action] || [];
  }

  /** Clear all voice confirmation requirements (for tests) */
  clearVoiceConfirmations() {
    this.voiceConfirmations.clear();
  }

  /**
   * Configure JSON Schemas for tool actions
   * @param {string} toolId
   * @param {Record<string,object>} mapping action -> JSONSchema
   */
  setActionSchemas(toolId, mapping) {
    this.actionSchemas.set(toolId, { ...(this.actionSchemas.get(toolId) || {}), ...mapping });
  }

  /** Get JSON schema for a specific action */
  getActionSchema(toolId, action) {
    const byTool = this.actionSchemas.get(toolId) || {};
    return byTool[action];
  }

  /** Get all action schemas for a tool */
  getAllActionSchemas(toolId) {
    return this.actionSchemas.get(toolId) || {};
  }

  /** Clear all schemas (for tests) */
  clearActionSchemas() {
    this.actionSchemas.clear();
  }
}

module.exports = new ToolRegistry(); 