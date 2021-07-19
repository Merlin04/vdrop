import { colors, styled } from "./theme";

export default styled("div", {
    borderRadius: "50%",
    width: "10rem",
    height: "10rem",
    backgroundColor: colors.dark,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    animation: "rotation 2s",
    animationIterationCount: "infinite"
}, {
    children: "Loading..."
});