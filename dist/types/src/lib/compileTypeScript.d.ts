interface CompilationResult {
    code: string;
    types: string;
}
export declare function compileTypeScript(code: string): CompilationResult | null;
export {};
