export declare function hashPassword(password: string): Promise<string>;
export declare function comparePassword(supplied: string, stored: string): Promise<boolean>;
export declare function generateSessionId(): string;
export declare function generateUserId(): string;
export declare function createSession(userId: string): Promise<string>;
export declare function getSessionUser(sessionId: string): Promise<any>;
export declare function deleteSession(sessionId: string): Promise<void>;
//# sourceMappingURL=auth.d.ts.map