import { DocumentationService } from './index.js';
async function main() {
    const docs = new DocumentationService();
    await docs.start();
}
main().catch(console.error);
//# sourceMappingURL=serve.js.map