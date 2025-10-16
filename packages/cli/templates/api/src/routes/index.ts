export class IndexRoutes {
  static async get() {
    return { message: 'Welcome to {{projectName}} API' };
  }
  
  static async health() {
    return { status: 'healthy', timestamp: new Date().toISOString() };
  }
}