import Loader from "./Loader";
import { styled } from "./theme";

export default styled<{ message?: string }>("div", {
    width: "100vw",
    height: "100vh",
    position: "absolute",
    left: 0,
    top: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    "& > p": {
        marginTop: "1rem"
    }
}, (props) => ({
    children: (
        <>
            <Loader />
            {props.message && <p>{props.message}</p>}
        </>
    )
}));

