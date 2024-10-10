import { KeyboardEvent, useRef } from "react";

type WibuHTMLInputElement = {
  [key in keyof HTMLInputElement as key]: HTMLInputElement[key];
};

interface WibuMutableRefObject<T> {
  current: T;
}

export function useWibuNextFocus() {
  const ref: WibuMutableRefObject<WibuHTMLInputElement[]> = useRef([]);
  const wibuNext = (
    wibuRef: WibuMutableRefObject<WibuHTMLInputElement[]>,
    index: number
  ) => ({
    ref: (el: WibuHTMLInputElement | null) =>
      el && ((wibuRef.current[index] = el) as any),
    onKeyDown: (e: KeyboardEvent<WibuHTMLInputElement>) => {
      try {
        e.key === "Enter" && wibuRef.current[index + 1].focus();
      } catch (error) {
        console.log("end of input");
      }
    }
  });
  return [ref, wibuNext] as const;
}
