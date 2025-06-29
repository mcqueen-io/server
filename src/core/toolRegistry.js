class ToolRegistry {
  constructor() {
    this.tools = new Map();
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
}

module.exports = new ToolRegistry(); 