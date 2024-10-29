export declare class AppUtils {
    private static _resolvedAppPath;
    static get appPath(): string;
    static init(): Promise<string>;
}
