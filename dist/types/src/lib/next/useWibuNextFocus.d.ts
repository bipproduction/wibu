import { KeyboardEvent } from "react";
type WibuHTMLInputElement = {
    [key in keyof HTMLInputElement as key]: HTMLInputElement[key];
};
interface WibuMutableRefObject<T> {
    current: T;
}
export declare function useWibuNextFocus(): readonly [WibuMutableRefObject<WibuHTMLInputElement[]>, (wibuRef: WibuMutableRefObject<WibuHTMLInputElement[]>, index: number) => {
    ref: (el: WibuHTMLInputElement | null) => any;
    onKeyDown: (e: KeyboardEvent<WibuHTMLInputElement>) => void;
}];
export {};
