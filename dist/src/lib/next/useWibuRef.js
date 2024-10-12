"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWibuRef = useWibuRef;
const react_1 = require("react");
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
function useWibuRef(initialValue, log = false) {
    const [value, setValue] = (0, react_1.useState)(initialValue);
    // Simpan keys dari initialValue sekali saja
    const keys = Object.keys(initialValue);
    // Mutable ref object that holds an array of WibuHTMLInputElement
    const ref = (0, react_1.useRef)([]);
    // Password and email validation regex
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    const emailRegex = /^\S+@\S+\.\S+$/;
    // Function to return the necessary handlers (ref and onKeyDown) for each input
    const wibuNext = (wibuRef, name) => {
        const index = keys.indexOf(name);
        return {
            ref: (el) => {
                if (el) {
                    wibuRef.current[index] = el;
                }
            },
            onKeyDown: (e) => {
                if (e.key === "Enter") {
                    const currentElement = wibuRef.current[index];
                    const nextElement = wibuRef.current[index + 1];
                    if (nextElement) {
                        // Clear error message and move to the next input
                        nextElement.focus();
                    }
                    else {
                        log && console.log("end of input");
                    }
                }
            },
            onChange: (e) => {
                setValue((prevValue) => ({
                    ...prevValue,
                    [name]: e.target.value
                }));
            },
            error: (name === "email" &&
                !emailRegex.test(value[name]) &&
                value[name].length > 0) ||
                (name === "password" &&
                    !passwordRegex.test(value[name]) &&
                    value[name].length > 0)
                ? true
                : false
        };
    };
    return [ref, wibuNext, value];
}
