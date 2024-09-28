export declare function decrypt({ token, encodedKey }: {
    token: string;
    encodedKey: string;
}): Promise<Record<string, any> | null>;
