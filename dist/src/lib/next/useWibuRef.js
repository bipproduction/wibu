"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWibuRef = useWibuRef;
const react_1 = require("react");
/**
 * ### GUIDE
 * [useWibuRef](https://github.com/bipproduction/wibu/tree/main/GUIDE/use-wibu-ref.md)
 */
function useWibuRef({ initialRef, initialValue, log = false }) {
    const [value, setValue] = (0, react_1.useState)(initialValue);
    const [globalValid, setGlobalValid] = (0, react_1.useState)(null);
    const keys = Object.keys(initialValue);
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    const emailRegex = /^\S+@\S+\.\S+$/;
    const wibuNext = (name) => {
        const index = keys.indexOf(name);
        const [validationError, setValidationError] = (0, react_1.useState)(null);
        return {
            ref: (el) => {
                if (el) {
                    initialRef.current[index] = el;
                }
            },
            onKeyDown: (e) => {
                if (e.key === "Enter") {
                    const nextElement = initialRef.current[index + 1];
                    if (nextElement && nextElement.focus && !validationError) {
                        nextElement.focus();
                    }
                    else {
                        log && console.log("No more inputs or end of form");
                    }
                }
            },
            onChange: (e) => {
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
    function revalidate(name, length = 0) {
        if (name === "email" &&
            !emailRegex.test(value[name]) &&
            value[name].length > 0) {
            return "Email is not valid";
        }
        if (name === "password" &&
            !passwordRegex.test(value[name]) &&
            value[name].length > length) {
            return "Password is not valid";
        }
        return null;
    }
    return {
        value,
        wibuNext,
        error: globalValid,
        empty: Object.values(value).includes("")
    };
}
