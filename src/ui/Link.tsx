import { colors, styled } from "./theme";

export default styled("a", {
    color: colors.dark,
    "&:hover": {
        textDecoration: "underline"
    }
});