export declare function geminiAi({ system, user, onStream }: {
    system: string;
    user: string;
    onStream?: (data: string | null | undefined) => void;
}): Promise<string>;
