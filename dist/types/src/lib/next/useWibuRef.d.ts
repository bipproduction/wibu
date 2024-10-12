import { KeyboardEvent } from "react";
type WibuHTMLInputElement = HTMLInputElement;
interface WibuMutableRefObject<T> {
    current: T;
}
/**
 * @example
 * const [ref, next, value] = useWibuRef({
    name: "",
    email: "",
    password: ""
  });
  ...
   <TextInput
      {...next(ref, "email")}
      placeholder="example: 0t3I5@example.com"
      label="email"
    />
 */
export declare function useWibuRef<Values extends Record<string, any>>(initialValue: Values, log?: boolean): readonly [WibuMutableRefObject<HTMLInputElement[]>, (wibuRef: WibuMutableRefObject<WibuHTMLInputElement[]>, name: keyof Values) => {
    ref: (el: WibuHTMLInputElement | null) => void;
    onKeyDown: (e: KeyboardEvent<WibuHTMLInputElement>) => void;
    onChange: (e: React.ChangeEvent<WibuHTMLInputElement>) => void;
    error: boolean;
}, Values];
export {};
