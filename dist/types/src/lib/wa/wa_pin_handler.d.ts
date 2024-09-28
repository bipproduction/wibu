type WAPinHandler = {
    status: string;
    id?: string | null;
};
export declare function waPinHandler({ nom, text }: {
    nom: number;
    text: string;
}): Promise<WAPinHandler>;
export {};
