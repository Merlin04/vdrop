import { useEffect, useMemo, useRef, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { getDayNumber } from "../src/date";
import Button from "../src/ui/Button";
import BackLink from "../src/BackLink";
import LoaderModal from "../src/ui/LoaderModal";
import Stack from "../src/ui/Stack";
import { colors } from "../src/ui/theme";

function useSwrLite<T>(url: string): { loading: boolean, data: T | undefined } {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<T | undefined>();
    useEffect(() => {
        (async () => {
            setLoading(true);
            const res = await fetch(url);
            setData(await res.json());
            setLoading(false);
        })();
    }, [url]);

    return { loading, data };
}

function useWaitForDrop(day: number): { loading: boolean, content: boolean } {
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState(false);
    useEffect(() => {
        (async () => {
            setLoading(true);

            async function checkAPI() {
                const res = await fetch("/api/getDrop?day=" + day);
                if(res.status === 202) {
                    // It's not done yet
                    setTimeout(checkAPI, 500);
                }
                else {
                    setContent(res.status !== 204);
                    setLoading(false);
                }
            }

            await checkAPI();
        })();
    }, [day]);

    return { loading, content };
}

/*function useRerender() {
    const [rerender, setRerender] = useState(false);
    return () => setRerender(!rerender);
}*/

const VID = "vdrop-player-video";

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 4rem)"
    },
    video: {
        marginTop: "1rem",
        flex: 1,
        "& > *": {
            //border: "4px solid " + colors.dark,
            //borderRadius: "1rem",
            width: "100%",
            height: "100%"
        },
        width: "100%",
        maxHeight: "calc(100% - 96.5px - 4rem)"
    }
}));

export default function Viewer() {
    const styles = useStyles();
    const [day, setDay] = useState(() => Math.floor(getDayNumber()));
    //const { loading, data } = useSwrLite<string[]>("/api/getVideoURLs?day=" + day);
    const { loading, content } = useWaitForDrop(day);
    //const shuffledData = useMemo(() => data?.sort(() => Math.random() - 0.5), [data]);
    //const [vidIndex, setVidIndex] = useState(0);

    /*useEffect(() => {
        function onComplete() {
            if(!shuffledData) return;
            if(vidIndex < shuffledData.length - 1) {
                setVidIndex(vidIndex + 1);
            }
            else {
                setVidIndex(0);
            }
        }

        const el = document.getElementById(VID);
        //if(!el) throw new Error("Video element is undefined");
        el?.addEventListener("ended", onComplete);
        return () => el?.removeEventListener("ended", onComplete);
    // I don't know if this will actually ever trigger but it's probably fine
    });*/

    return (loading/* || !shuffledData*/) ? (
        <LoaderModal message="This may take a while" />
    ) : (
        <div className={styles.root}>
            <BackLink />
            <h1>Day {day}</h1>
            <Stack direction="row">
                <Button disabled={day === 1} onClick={() => setDay(day - 1)}>&lt;-</Button>
                {/*<Button disabled={shuffledData.length === 0}>Play</Button>*/}
                <Button disabled={day === Math.floor(getDayNumber())} onClick={() => setDay(day + 1)}>-&gt;</Button>
            </Stack>
            {!content ? (
                <div>Nobody contributed to that day's drop :(</div>
            ) : (
                <>
                    <div className={styles.video}>
                        <video id={VID} autoPlay src={/*`/api/getVideo?path=${day}%2F${shuffledData[vidIndex]}`*/"/api/getDrop?day=" + day}>Please get a browser made in the last decade</video>
                    </div>
                    {/*<h3>{shuffledData[vidIndex]}</h3>*/}
                </>
            )}
        </div>
    );
}