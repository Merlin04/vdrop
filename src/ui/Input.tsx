import { makeStyles } from "@material-ui/styles"
import { baseControlStyles } from "./Button";
import { addPropsClassName, colors, styled } from "./theme";

export default styled("input", {
    ...baseControlStyles,
    outline: "none",
    "&:focus": {
        transition: "border 0.1s ease-in-out, padding 0.1s ease-in-out",
        border: "2px solid " + colors.dark,
        padding: "calc(0.5rem - 2px)",
        //marginRight: "calc(1rem + 4px)"
    },
    boxSizing: "border-box"
});