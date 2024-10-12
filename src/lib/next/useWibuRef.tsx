import { KeyboardEvent, MutableRefObject, useState } from "react";

/**
 * ### GUIDE
 * [useWibuRef](https://github.com/bipproduction/wibu/tree/main/GUIDE/use-wibu-ref.md)
 */
export function useWibuRef<Values extends Record<string, any>>({
  initialRef,
  initialValue,
  log = false
}: {
  initialRef: MutableRefObject<any[]>;
  initialValue: Values;
  log?: boolean;
}) {
  const [value, setValue] = useState(initialValue);
  const [globalValid, setGlobalValid] = useState<string | null>(null);

  const keys = Object.keys(initialValue) as (keyof Values)[];

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  const emailRegex = /^\S+@\S+\.\S+$/;

  const wibuNext = (name: keyof Values) => {
    const index = keys.indexOf(name);
    const [validationError, setValidationError] = useState<string | null>(null);

    return {
      ref: (el: HTMLInputElement | null) => {
        if (el) {
          initialRef.current[index] = el;
        }
      },
      onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          const nextElement = initialRef.current[index + 1];

          if (nextElement && nextElement.focus && !validationError) {
            nextElement.focus();
          } else {
            log && console.log("No more inputs or end of form");
          }
        }
      },
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value: inputValue } = e.target;
        const errorMessage = revalidate(name);
        setValidationError(errorMessage);
        setGlobalValid(errorMessage);
        setValue((prevValue) => ({
          ...prevValue,
          [name]: inputValue
        }));
      },
      error: validationError
    };
  };

  function revalidate(name: keyof Values, length: number = 0) {
    if (
      name === "email" &&
      !emailRegex.test(value[name]) &&
      value[name].length > 0
    ) {
      return "Email is not valid";
    }
    if (
      name === "password" &&
      !passwordRegex.test(value[name]) &&
      value[name].length > length
    ) {
      return "Password is not valid";
    }
    return null;
  }

  return {
    value,
    wibuNext,
    error: globalValid,
    empty: Object.values(value).includes("")
  } as const;
}
