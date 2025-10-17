/**
 * Comprehensive Synapse Framework Documentation System
 *
 * This system provides complete documentation for all 23 Synapse packages
 * with interactive getting started wizard, TDD approach, clean code principles,
 * design patterns, and comprehensive API coverage.
 *
 * @author Synapse Framework Team
 * @version 2.0.0
 */
interface DocumentationPackage {
    name: string;
    version: string;
    description: string;
    category: 'core' | 'enterprise' | 'nextgen' | 'futuristic' | 'development';
    classes: DocumentationClass[];
    methods: DocumentationMethod[];
    examples: DocumentationExample[];
    designPatterns: string[];
    testCoverage: number;
    dependencies: string[];
    features: string[];
    performance: {
        bundleSize: string;
        loadTime: string;
        memoryUsage: string;
    };
}
interface DocumentationClass {
    name: string;
    description: string;
    methods: DocumentationMethod[];
    properties: DocumentationProperty[];
    examples: string[];
    designPatterns: string[];
    testCoverage: number;
}
interface DocumentationMethod {
    name: string;
    description: string;
    parameters: DocumentationParameter[];
    returnType: string;
    examples: string[];
    complexity: 'O(1)' | 'O(n)' | 'O(log n)' | 'O(n²)' | 'O(n log n)';
    isAsync: boolean;
    isDeprecated: boolean;
    since: string;
}
interface DocumentationParameter {
    name: string;
    type: string;
    description: string;
    required: boolean;
    defaultValue?: any;
}
interface DocumentationProperty {
    name: string;
    type: string;
    description: string;
    isReadonly: boolean;
    isOptional: boolean;
}
interface DocumentationExample {
    id: string;
    title: string;
    description: string;
    code: string;
    language: 'typescript' | 'javascript' | 'html' | 'css' | 'json' | 'bash' | 'webml';
    category: string;
    package: string;
    isInteractive: boolean;
    isRunnable: boolean;
    dependencies: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: number;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
interface DocumentationTutorial {
    id: string;
    title: string;
    description: string;
    steps: TutorialStep[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: number;
    prerequisites: string[];
    category: string;
    isPublished: boolean;
    completionRate: number;
    createdAt: Date;
    updatedAt: Date;
}
interface TutorialStep {
    id: string;
    title: string;
    content: string;
    code?: string;
    language?: string;
    isOptional: boolean;
    isInteractive: boolean;
    expectedOutcome: string;
    hints: string[];
    validation: {
        type: 'code' | 'output' | 'manual';
        criteria: string;
    };
}
interface GettingStartedWizard {
    id: string;
    title: string;
    description: string;
    steps: WizardStep[];
    currentStep: number;
    userPreferences: {
        experience: 'beginner' | 'intermediate' | 'advanced';
        focus: 'web' | 'api' | 'ai' | 'blockchain' | 'pwa' | 'all';
        language: 'typescript' | 'javascript';
    };
}
interface WizardStep {
    id: string;
    title: string;
    description: string;
    type: 'installation' | 'configuration' | 'example' | 'interactive' | 'quiz';
    content: string;
    codeExample?: string;
    isRequired: boolean;
    validation?: {
        type: 'code' | 'output' | 'manual';
        criteria: string;
    };
    nextSteps: string[];
}
interface DesignPattern {
    name: string;
    category: 'creational' | 'structural' | 'behavioral';
    description: string;
    problem: string;
    solution: string;
    example: string;
    benefits: string[];
    drawbacks: string[];
    relatedPatterns: string[];
    useCases: string[];
}
interface CleanCodePrinciple {
    name: string;
    description: string;
    examples: {
        bad: string;
        good: string;
    };
    benefits: string[];
    implementation: string;
}
declare class DocumentationService {
    private server;
    private database;
    private templateEngine;
    private auth;
    private packages;
    private examples;
    private tutorials;
    private designPatterns;
    private cleanCodePrinciples;
    private wizard;
    constructor();
    initialize(): Promise<void>;
    private initializeAllPackages;
    private initializeCorePackage;
    private initializeRoutingPackage;
    private initializeDatabasePackage;
    private initializeAuthPackage;
    private initializeTemplatingPackage;
    private initializeTestingPackage;
    private initializeGraphQLPackage;
    private initializeMicroservicesPackage;
    private initializeAPIDocsPackage;
    private initializeFileUploadPackage;
    private initializeEmailPackage;
    private initializeNotificationsPackage;
    private initializeAIPackage;
    private initializeBlockchainPackage;
    private initializeCollaborationPackage;
    private initializeWorkflowPackage;
    private initializePWAPackage;
    private initializeVoicePackage;
    private initializeWebAssemblyPackage;
    private initializeWebRTCPackage;
    private initializeUIPackage;
    private initializeCLIPackage;
    private initializeStakeholderPackage;
    private initializeGettingStartedWizard;
    getDocumentedPackages(): Promise<string[]>;
    getGettingStartedWizard(): Promise<GettingStartedWizard>;
    getInteractiveExamples(): Promise<DocumentationExample[]>;
    getAPIReference(): Promise<{
        packages: DocumentationPackage[];
    }>;
    getDesignPatterns(): Promise<string[]>;
    getCleanCodePrinciples(): Promise<string[]>;
    getTDDContent(): Promise<string>;
    getPerformanceContent(): Promise<string>;
    getAccessibilityContent(): Promise<string>;
    getSEOContent(): Promise<string>;
    private setupDatabase;
    private generateComprehensiveContent;
    private addExamples;
    private setupRoutes;
    private generatePackageCard;
    private generateExampleCard;
    private generatePatternCard;
    private getPackageTemplate;
    private generatePackageFeatures;
    private generatePackageClasses;
    private generatePackageExamples;
    private generateAPIContent;
    private getHomeTemplate;
    private getWizardTemplate;
    private getAPITemplate;
    private getExamplesTemplate;
    private getPatternsTemplate;
    private getCleanCodeTemplate;
    private getTDDTemplate;
    private getPerformanceTemplate;
    private getAccessibilityTemplate;
    private getSEOTemplate;
    private get404Page;
    start(): Promise<void>;
}
export { DocumentationService };
export type { DocumentationPackage, DocumentationClass, DocumentationMethod, DocumentationExample, DocumentationTutorial, GettingStartedWizard, DesignPattern, CleanCodePrinciple };
//# sourceMappingURL=index.d.ts.map