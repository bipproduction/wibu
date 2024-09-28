export declare function verifyToken({ token, encodedKey }: {
    token: string | undefined;
    encodedKey: string;
}): Promise<Record<string, unknown> | null>;
