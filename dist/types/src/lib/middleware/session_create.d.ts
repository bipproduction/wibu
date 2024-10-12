export declare function sessionCreate({ sessionKey, exp, encodedKey, user }: {
    sessionKey: string;
    exp?: string;
    encodedKey: string;
    user: Record<string, unknown>;
}): Promise<string | null>;
