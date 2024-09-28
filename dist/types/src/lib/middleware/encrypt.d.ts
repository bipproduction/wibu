export declare function encrypt({ user, exp, encodedKey }: {
    user: Record<string, any>;
    exp?: string;
    encodedKey: string;
}): Promise<string | null>;
