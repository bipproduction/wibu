import { KeyboardEvent, useRef, useState } from "react";

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
export function useWibuRef<Values extends Record<string, any>>(
  initialValue: Values,
  log: boolean = false
) {
  const [value, setValue] = useState(initialValue);

  // Simpan keys dari initialValue sekali saja
  const keys = Object.keys(initialValue) as (keyof Values)[];

  // Mutable ref object that holds an array of WibuHTMLInputElement
  const ref: WibuMutableRefObject<WibuHTMLInputElement[]> = useRef([]);

  // Password and email validation regex
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  const emailRegex = /^\S+@\S+\.\S+$/;

  // Function to return the necessary handlers (ref and onKeyDown) for each input
  const wibuNext = (
    wibuRef: WibuMutableRefObject<WibuHTMLInputElement[]>,
    name: keyof Values
  ) => {
    const index = keys.indexOf(name);

    return {
      ref: (el: WibuHTMLInputElement | null) => {
        if (el) {
          wibuRef.current[index] = el;
        }
      },
      onKeyDown: (e: KeyboardEvent<WibuHTMLInputElement>) => {
        if (e.key === "Enter") {
          const currentElement = wibuRef.current[index];
          const nextElement = wibuRef.current[index + 1];

          if (nextElement) {
            // Clear error message and move to the next input
            nextElement.focus();
          } else {
            log && console.log("end of input");
          }
        }
      },
      onChange: (e: React.ChangeEvent<WibuHTMLInputElement>) => {
        setValue((prevValue) => ({
          ...prevValue,
          [name]: e.target.value
        }));
      },
      error:
        (name === "email" &&
          !emailRegex.test(value[name]) &&
          value[name].length > 0) ||
        (name === "password" &&
          !passwordRegex.test(value[name]) &&
          value[name].length > 0)
          ? true
          : false
    };
  };

  return [ref, wibuNext, value] as const;
}
