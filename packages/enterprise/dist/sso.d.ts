/**
 * Single Sign-On Provider
 * Comprehensive SSO implementation with SAML, OAuth2, OIDC, LDAP support
 */
export type SSOType = 'saml' | 'oauth2' | 'oidc' | 'ldap';
export interface SSOConfig {
    readonly type: SSOType;
    readonly provider: string;
    readonly clientId: string;
    readonly clientSecret: string;
    readonly redirectUri: string;
    readonly scopes?: string[];
    readonly metadata?: Record<string, unknown>;
}
export interface SSOUser {
    readonly id: string;
    readonly email: string;
    readonly name: string;
    readonly roles: string[];
    readonly groups?: string[];
    readonly metadata?: Record<string, unknown>;
    readonly provider: string;
    readonly providerUserId: string;
}
export interface SAMLConfig extends SSOConfig {
    readonly type: 'saml';
    readonly entryPoint: string;
    readonly issuer: string;
    readonly cert: string;
    readonly identifierFormat?: string;
    readonly signatureAlgorithm?: string;
}
export interface OAuth2Config extends SSOConfig {
    readonly type: 'oauth2';
    readonly authorizationUrl: string;
    readonly tokenUrl: string;
    readonly userInfoUrl: string;
    readonly responseType?: string;
    readonly grantType?: string;
}
export interface OIDCConfig extends SSOConfig {
    readonly type: 'oidc';
    readonly discoveryUrl: string;
    readonly issuer: string;
    readonly jwksUri?: string;
    readonly responseType?: string;
}
export interface LDAPConfig extends SSOConfig {
    readonly type: 'ldap';
    readonly host: string;
    readonly port: number;
    readonly baseDN: string;
    readonly bindDN?: string;
    readonly bindPassword?: string;
    readonly searchFilter?: string;
    readonly useTLS?: boolean;
}
export type AnySSOConfig = SAMLConfig | OAuth2Config | OIDCConfig | LDAPConfig;
export interface SSOSession {
    readonly sessionId: string;
    readonly userId: string;
    readonly provider: string;
    readonly createdAt: number;
    readonly expiresAt: number;
    readonly metadata?: Record<string, unknown>;
}
export interface SSOAuthResult {
    readonly success: boolean;
    readonly user?: SSOUser;
    readonly session?: SSOSession;
    readonly error?: string;
}
/**
 * SAML Authentication Provider
 */
export declare class SAMLProvider {
    private readonly config;
    constructor(config: SAMLConfig);
    authenticate(samlResponse: string): Promise<SSOAuthResult>;
    getLoginUrl(relayState?: string): string;
    private createSAMLRequest;
    private parseSAMLResponse;
    private validateAssertion;
    private extractUserFromAssertion;
    private createSession;
    private generateId;
}
/**
 * OAuth2 Authentication Provider
 */
export declare class OAuth2Provider {
    private readonly config;
    constructor(config: OAuth2Config);
    authenticate(code: string): Promise<SSOAuthResult>;
    getAuthorizationUrl(state?: string): string;
    private exchangeCodeForToken;
    private getUserInfo;
    private createUserFromInfo;
    private createSession;
    private generateState;
    private generateId;
}
/**
 * OIDC (OpenID Connect) Authentication Provider
 */
export declare class OIDCProvider {
    private readonly config;
    private discoveryDocument;
    constructor(config: OIDCConfig);
    authenticate(idToken: string): Promise<SSOAuthResult>;
    getAuthorizationUrl(nonce?: string, state?: string): Promise<string>;
    private getDiscoveryDocument;
    private verifyIdToken;
    private createUserFromClaims;
    private createSession;
    private generateNonce;
    private generateState;
    private generateId;
}
/**
 * LDAP Authentication Provider
 */
export declare class LDAPProvider {
    private readonly config;
    constructor(config: LDAPConfig);
    authenticate(username: string, password: string): Promise<SSOAuthResult>;
    searchUser(username: string): Promise<Record<string, unknown> | null>;
    verifyConnection(): Promise<boolean>;
    private bind;
    private createUserFromEntry;
    private extractGroupName;
    private mapGroupsToRoles;
    private createSession;
    private generateId;
}
/**
 * Unified SSO Provider that supports all authentication types
 */
export declare class SSOProvider {
    private readonly config;
    private readonly provider;
    constructor(config: AnySSOConfig);
    authenticate(credentials: string | {
        username: string;
        password: string;
    }): Promise<SSOAuthResult>;
    getAuthUrl(options?: {
        state?: string;
        nonce?: string;
        relayState?: string;
    }): Promise<string>;
    logout(userId: string): Promise<void>;
    private createProvider;
}
//# sourceMappingURL=sso.d.ts.map