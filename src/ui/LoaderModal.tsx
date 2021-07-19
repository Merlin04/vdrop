import Loader from "./Loader";
import { styled } from "./theme";

export default styled("div", {
    width: "100vw",
    height: "100vh",
    position: "absolute",
    left: 0,
    top: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
}, {
    children: <Loader/>
});