/**
 * Compliance Manager
 * Comprehensive compliance tools for GDPR, HIPAA, SOC2, PCI-DSS
 * Includes data privacy controls, retention policies, and right-to-be-forgotten
 */
export type ComplianceStandard = 'GDPR' | 'HIPAA' | 'SOC2' | 'PCI-DSS' | 'ISO27001' | 'CCPA';
export type ComplianceStatus = 'compliant' | 'non-compliant' | 'partial' | 'pending';
export interface ComplianceReport {
    readonly standard: ComplianceStandard;
    readonly status: ComplianceStatus;
    readonly score: number;
    readonly checks: ComplianceCheck[];
    readonly recommendations: string[];
    readonly timestamp: number;
    readonly nextAuditDate?: number;
}
export interface ComplianceCheck {
    readonly id: string;
    readonly name: string;
    readonly category: string;
    readonly passed: boolean;
    readonly required: boolean;
    readonly severity: 'low' | 'medium' | 'high' | 'critical';
    readonly details: string;
    readonly remediation?: string;
}
export interface DataPrivacyControl {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly enabled: boolean;
    readonly configuration: Record<string, unknown>;
}
export interface DataRetentionPolicy {
    readonly id: string;
    readonly name: string;
    readonly dataType: string;
    readonly retentionPeriod: number;
    readonly deletionMethod: 'soft' | 'hard' | 'anonymize';
    readonly enabled: boolean;
}
export interface ConsentRecord {
    readonly id: string;
    readonly userId: string;
    readonly purpose: string;
    readonly granted: boolean;
    readonly timestamp: number;
    readonly ipAddress?: string;
    readonly version: string;
    readonly expiresAt?: number;
}
export interface DataSubjectRequest {
    readonly id: string;
    readonly userId: string;
    readonly type: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection';
    readonly status: 'pending' | 'in_progress' | 'completed' | 'rejected';
    readonly requestedAt: number;
    readonly completedAt?: number;
    readonly notes?: string;
}
export interface GDPRComplianceConfig {
    readonly dataProtectionOfficer?: string;
    readonly privacyPolicyUrl?: string;
    readonly consentRequired: boolean;
    readonly rightToErasure: boolean;
    readonly rightToPortability: boolean;
    readonly dataBreachNotification: boolean;
    readonly dataMinimization: boolean;
}
export interface HIPAAComplianceConfig {
    readonly securityOfficer?: string;
    readonly privacyOfficer?: string;
    readonly phiEncryption: boolean;
    readonly accessControls: boolean;
    readonly auditControls: boolean;
    readonly integrityControls: boolean;
    readonly transmissionSecurity: boolean;
}
export interface SOC2ComplianceConfig {
    readonly securityPrinciple: boolean;
    readonly availabilityPrinciple: boolean;
    readonly processingIntegrityPrinciple: boolean;
    readonly confidentialityPrinciple: boolean;
    readonly privacyPrinciple: boolean;
    readonly controlDocumentation: boolean;
}
/**
 * GDPR Compliance Manager
 */
export declare class GDPRComplianceManager {
    private readonly config;
    private readonly consents;
    private readonly requests;
    constructor(config: GDPRComplianceConfig);
    performAudit(): ComplianceCheck[];
    recordConsent(userId: string, purpose: string, granted: boolean, version: string): ConsentRecord;
    getConsents(userId: string): ConsentRecord[];
    handleDataSubjectRequest(userId: string, type: DataSubjectRequest['type']): Promise<DataSubjectRequest>;
    private processErasureRequest;
    private processPortabilityRequest;
}
/**
 * HIPAA Compliance Manager
 */
export declare class HIPAAComplianceManager {
    private readonly config;
    constructor(config: HIPAAComplianceConfig);
    performAudit(): ComplianceCheck[];
    validatePHIAccess(userId: string, resourceId: string, action: string): boolean;
    sanitizePHI(data: Record<string, unknown>): Promise<Record<string, unknown>>;
}
/**
 * SOC2 Compliance Manager
 */
export declare class SOC2ComplianceManager {
    private readonly config;
    constructor(config: SOC2ComplianceConfig);
    performAudit(): ComplianceCheck[];
    generateControlMatrix(): Promise<Record<string, unknown>>;
}
/**
 * Data Retention Policy Manager
 */
export declare class DataRetentionManager {
    private readonly policies;
    addPolicy(policy: DataRetentionPolicy): void;
    getPolicy(id: string): DataRetentionPolicy | undefined;
    enforceRetention(): Promise<void>;
    deleteData(dataId: string, method: 'soft' | 'hard' | 'anonymize'): Promise<void>;
}
/**
 * Main Compliance Manager
 */
export declare class ComplianceManager {
    private readonly gdprManager?;
    private readonly hipaaManager?;
    private readonly soc2Manager?;
    private readonly retentionManager;
    constructor(configs?: {
        gdpr?: GDPRComplianceConfig;
        hipaa?: HIPAAComplianceConfig;
        soc2?: SOC2ComplianceConfig;
    });
    generateReport(standard: ComplianceStandard): Promise<ComplianceReport>;
    performAudit(standard: ComplianceStandard): Promise<ComplianceReport>;
    getRetentionManager(): DataRetentionManager;
    getGDPRManager(): GDPRComplianceManager | undefined;
    getHIPAAManager(): HIPAAComplianceManager | undefined;
    getSOC2Manager(): SOC2ComplianceManager | undefined;
    private performGenericChecks;
}
//# sourceMappingURL=compliance.d.ts.map