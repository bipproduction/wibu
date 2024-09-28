"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileTypeScript = compileTypeScript;
const ts = __importStar(require("typescript"));
function compileTypeScript(code) {
    const fileName = 'module.ts';
    const compilerOptions = {
        module: ts.ModuleKind.CommonJS, // Menggunakan CommonJS module
        target: ts.ScriptTarget.ES5, // Target ES5
        noEmitOnError: true, // Tidak menghasilkan output jika ada error
        noImplicitAny: true, // Mengaktifkan noImplicitAny
        declaration: true, // Menghasilkan file deklarasi (.d.ts)
        strict: true, // Mengaktifkan semua opsi strict
        esModuleInterop: true, // Memungkinkan interoperability dengan module ES
    };
    // Membuat SourceFile dari kode TypeScript
    const sourceFile = ts.createSourceFile(fileName, code, compilerOptions.target, true);
    // Objek untuk menyimpan hasil output
    const output = {};
    // Implements custom Compiler Host
    const compilerHost = {
        // Mendapatkan SourceFile
        getSourceFile: (name, languageVersion) => {
            if (name === fileName) {
                return sourceFile;
            }
            // Menangani file library bawaan TypeScript
            const libSource = ts.sys.readFile(name);
            if (libSource !== undefined) {
                return ts.createSourceFile(name, libSource, languageVersion);
            }
            return undefined;
        },
        // Menangani penulisan file output
        writeFile: (name, text, writeByteOrderMark, onError, sourceFiles) => {
            output[name] = text;
        },
        // Mendapatkan nama file library bawaan
        getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
        // Case sensitivity
        useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
        // Mendapatkan canonical file name
        getCanonicalFileName: (name) => ts.sys.useCaseSensitiveFileNames ? name : name.toLowerCase(),
        // Mendapatkan direktori saat ini
        getCurrentDirectory: () => '',
        // Mendapatkan karakter new line
        getNewLine: () => ts.sys.newLine,
        // Mengecek apakah file ada
        fileExists: (name) => name === fileName || ts.sys.fileExists(name),
        // Membaca isi file
        readFile: (name) => name === fileName ? code : ts.sys.readFile(name),
        // Mengecek apakah direktori ada
        directoryExists: ts.sys.directoryExists,
        // Mendapatkan direktori dalam path
        getDirectories: ts.sys.getDirectories,
    };
    // Membuat program TypeScript
    const program = ts.createProgram([fileName], compilerOptions, compilerHost);
    // Mendapatkan diagnostik sebelum emit
    const diagnostics = ts.getPreEmitDiagnostics(program);
    if (diagnostics.length > 0) {
        diagnostics.forEach(diagnostic => {
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            if (diagnostic.file) {
                let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
            }
            else {
                console.error(message);
            }
        });
        return null;
    }
    // Emit program (menghasilkan .js dan .d.ts)
    const emitResult = program.emit();
    // Cek diagnostik setelah emit
    const emitDiagnostics = emitResult.diagnostics;
    if (emitDiagnostics.length > 0) {
        emitDiagnostics.forEach(diagnostic => {
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            if (diagnostic.file) {
                let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
            }
            else {
                console.error(message);
            }
        });
        return null;
    }
    // Nama file output
    const jsFileName = 'module.js';
    const dtsFileName = 'module.d.ts';
    const jsCode = output[jsFileName];
    const dtsCode = output[dtsFileName];
    if (!jsCode || !dtsCode) {
        console.error('Gagal menghasilkan baik file JS maupun deklarasi type.');
        return null;
    }
    return { code: jsCode, types: dtsCode };
}
