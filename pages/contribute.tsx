import { makeStyles } from "@material-ui/styles";
import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";
import { getDayNumber } from "../src/date";
import Button from "../src/ui/Button";
import Input from "../src/ui/Input";
import Link from "../src/ui/Link";
import Stack from "../src/ui/Stack";
import { colors } from "../src/ui/theme";

enum State {
    PRERECORD,
    COUNTDOWN,
    RECORDING,
    UPLOADING,
    DONE
}

// https://github.com/webrtc/samples/blob/gh-pages/src/content/getusermedia/record/js/main.js#L70
function getSupportedMimeTypes() {
    const possibleTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/mp4;codecs=h264,aac',
    ];
    return possibleTypes.filter(mimeType => {
      return MediaRecorder.isTypeSupported(mimeType);
    });
  }

const useStyles = makeStyles(() => ({
    root: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column"
    },
    nameInput: {
        width: "20rem"
    },
    alreadySubmittedError: {
        backgroundColor: "red",
        marginTop: "1rem",
        padding: "0.5rem"
    },
    countdownNumber: {
        fontSize: "10rem",
        margin: "1rem"
    },
    countdownBars: {
        "& > *": {
            backgroundColor: "white",
            border: "5px solid " + colors.neutral,
            margin: "0.5rem 0",
            flex: 1
        },
        "& > .active": {
            borderColor: "green"
        },
        display: "flex",
        flexDirection: "row",
        height: "1rem"
    },
    video: {
        maxHeight: "500px"
    }
}));

const VIDEO_ID = "vdrop-contribute-video";

export default function Contribute() {
    const styles = useStyles();
    const [state, _internal_setState] = useState(State.PRERECORD);
    const [countdown, setCountdown] = useState(3);
    const [username, setUsername] = useState("");
    const [showAlreadySubmitted, setShowAlreadySubmitted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const stream = useRef<MediaStream | null>(null);
    const recorder = useRef<MediaRecorder | null>(null);
    const chunks = useRef<any[]>([]);

    function setCountdownTimeout(newCountdown?: number) {
        const countdownLatest = newCountdown ?? countdown;
        setTimeout(() => {
            if(countdownLatest > 0) {
                setCountdown(countdownLatest - 1);
                setCountdownTimeout(countdownLatest - 1);
            }
            else {
                //setState(State.RECORDING);
            }
        }, 1000);
    }

    useEffect(() => {
        if(state === State.COUNTDOWN && videoRef.current) {
            videoRef.current.srcObject = stream.current;
        }
    }, [Boolean(videoRef.current)]);

    async function setState(newState: State) {
        switch(newState) {
            case State.COUNTDOWN: {
                // Validate username
                const res: string[] = await (
                    await fetch(
                        "/api/getVideoURLs?day=" + Math.ceil(getDayNumber())
                    )
                ).json();
                if(res.includes(username)) {
                    setShowAlreadySubmitted(true);
                    // Stop early
                    return;
                }
                console.log(res);
                stream.current = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: {
                        width: 1280,
                        height: 1280
                    }
                });
                setCountdownTimeout();
                break;
            }
            case State.RECORDING: {
                if(!stream.current) throw new Error("Stream is null, this should not happen");
                recorder.current = new MediaRecorder(stream.current, {
                    mimeType: getSupportedMimeTypes()[0]
                });
                recorder.current.start();
                recorder.current.ondataavailable = e => {
                    if(e.data.size > 0) {
                        chunks.current.push(e.data);
                    }
                };
                recorder.current.onstop = async () => {
                    _internal_setState(State.UPLOADING);
                    const blob = new Blob(chunks.current, {
                        type: "video/mp4"
                    });
                    chunks.current = [];

                    if(!recorder.current) throw new Error("Recorder is null, this should never happen");

                    const fd = new FormData();
                    fd.append("name", username);
                    fd.append("video", blob);
                    const response = await fetch("/api/upload", {
                        method: "POST",
                        body: fd
                    });
                    setState(State.DONE);
                };
                setTimeout(() => {
                    recorder.current?.stop();
                }, 2000);
                break;
            }
        }

        _internal_setState(newState);
    }

    function renderCountdown() {
        const children: React.ReactNodeArray = [];

        for(let i = 3; i > 0; i--) {
            children.push(<div key={i} className={i > countdown ? "active" : undefined}></div>);
        }

        return children;
    }

    return (
        <div className={styles.root}>
            <NextLink href="/" passHref><Link>Back to home page</Link></NextLink>
            <h1>Contribute to the drop</h1>

            {state === State.PRERECORD && (
                <>
                    <h2>Before you start (don't worry, it's quick):</h2>
                    <ul>
                        <li>When you click record, there will be a short countdown, then recording will start</li>
                        <li>Once the 0.5 seconds is up, your video will automatically be uploaded to the server. You don't get a chance to review or edit it</li>
                        <li>If you want me to delete your video, just come find me (Benjamin Smith) on the train. Don't do this unless absolutely necessary, the point is for the videos to be not perfect</li>
                        <li>0.5 seconds is probably much shorter than you will expect</li>
                    </ul>

                    <Stack direction="row">
                        <Input className={styles.nameInput} value={username} onChange={ e => setUsername(e.target.value) } placeholder="ZephyrNet username" />
                        <Button onClick={() => setState(State.COUNTDOWN)} disabled={username.trim().length === 0}>Record!</Button>
                    </Stack>
                    {showAlreadySubmitted && (
                        <div className={styles.alreadySubmittedError}>You've already submitted a video today. If this is an error, or if you need to rerecord your submission, let me know and I'll fix it.</div>
                    )}
                </>
            )}

            {state === State.COUNTDOWN && (
                <>
                    <h1 className={styles.countdownNumber}>
                        {countdown}
                    </h1>
                    <div className={styles.countdownBars}>
                        {renderCountdown()}
                    </div>
                </>
            )}

            {state === State.RECORDING && (
                <>
                    <h2>GOGOGOOGOGOGOGOGOGOGOOGOGOGOGOGOGOOGOGOGOGO</h2>
                </>
            )}

            {(state === State.COUNTDOWN || state === State.RECORDING) && (
                <>
                    <video ref={videoRef} className={styles.video} autoPlay playsInline id={VIDEO_ID}>
                        I'm surprised you're even able to use this nextjs app in a browser that doesn't support the video element
                    </video>
                </>
            )}

            {state === State.UPLOADING && (
                <h2>Uploading</h2>
            )}

            {state === State.DONE && (
                <>
                    <h2>There, you did it</h2>
                    <h3>Check VDrop tomorrow to see the drop you helped make</h3>
                    <Link href="/"><Button>Home page</Button></Link>
                </>
            )}
        </div>
    );
}