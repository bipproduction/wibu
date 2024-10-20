import { KeyboardEvent, MutableRefObject } from "react";
/**
 * # GUIDE
 * @see https://github.com/bipproduction/wibu/tree/main/GUIDE/use-wibu-ref.md
 */
export declare function useWibuRef<Values extends Record<string, any>>({ initialRef, initialValue, log }: {
    initialRef: MutableRefObject<any[]>;
    initialValue: Values;
    log?: boolean;
}): {
    readonly value: Values;
    readonly wibuNext: (name: keyof Values) => {
        ref: (el: HTMLInputElement | null) => void;
        onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        error: string | null;
    };
    readonly error: string | null;
    readonly empty: boolean;
};
