"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWibuNextFocus = useWibuNextFocus;
const react_1 = require("react");
function useWibuNextFocus() {
    const ref = (0, react_1.useRef)([]);
    const wibuNext = (wibuRef, index) => ({
        ref: (el) => el && (wibuRef.current[index] = el),
        onKeyDown: (e) => {
            try {
                e.key === "Enter" && wibuRef.current[index + 1].focus();
            }
            catch (error) {
                console.log("end of input");
            }
        }
    });
    return [ref, wibuNext];
}
