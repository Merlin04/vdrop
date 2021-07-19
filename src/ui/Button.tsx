import { CreateCSSProperties } from "@material-ui/styles";
import { colors, styled } from "./theme";

export const baseControlStyles: CreateCSSProperties<{}> = {
    backgroundColor: colors.neutral,
    fontSize: "1.2rem",
    padding: "0.5rem",
    border: "none",
    borderRadius: "0.25rem",
    "&:disabled": {
        color: "gray"
    }
};

export default styled("button", {
    ...baseControlStyles,
    display: "inline-block",
    maxWidth: "max-content",
    "&:hover": {
        backgroundColor: colors.neutral + "aa"
    },
    "&:focus": {
        backgroundColor: colors.neutral + "aa",
        transform: "scale(0)"
    },
    transition: "background-color 0.25s ease-in-out, transform 3s ease-in-out"
});