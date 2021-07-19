import NextLink from "next/link";
import { useEffect, useState } from "react";
import { getDayNumber, MS_IN_DAY, START_DATE } from "../src/date";
import Banner from "../src/ui/Banner";
import Button from '../src/ui/Button';
import Link from "../src/ui/Link";

function dateTimeComponentToString(n: Number) {
  return n.toString().padStart(2, "0");
}

export default function Home() {
  function getTimeUntilNextDrop() {
    const d = new Date((START_DATE - Date.now()) % MS_IN_DAY);
    return `${dateTimeComponentToString(d.getUTCHours())}:${dateTimeComponentToString(d.getUTCMinutes())}:${dateTimeComponentToString(d.getUTCSeconds())}`;
  }

  const [timeUntilNextDrop, setTimeUntilNextDrop] = useState(getTimeUntilNextDrop);

  useEffect(() => {
    function setTimeUpdateTimeout() {
      setTimeout(() => {
        setTimeUntilNextDrop(getTimeUntilNextDrop());
        setTimeUpdateTimeout();
      }, 1000);
    }
    setTimeUpdateTimeout();
  }, []);

  return (
    <div>
      <Banner>{timeUntilNextDrop} until next drop</Banner>
      <h1>VDrop</h1>
      <h2>Community-powered super-short daily video drops</h2>
      <h3>How it works:</h3>
      <ol>
        <li>Sign in with your ZephyrNet account</li>
        <li>Click record</li>
        <li>Do something for 0.5 seconds</li>
        <li>Your video will automatically upload, come back tomorrow to watch the drop you contributed to</li>
      </ol>

      <NextLink href="/contribute"><Button>Let's go</Button></NextLink>

      {getDayNumber() > 1 && (
        <h2><NextLink href="/viewer" passHref><Link>Check out today's drop</Link></NextLink></h2>
      )}

      <h2>Why?</h2>

      <p>VDrop is an experiment to try to capture the general feel of Zephyr without any specific details. The daily video archives an aspect of the trip very apparent to everyone onboard but invisible to everyone else.</p>

      <h3>Justifications</h3>

      <p>I've made some odd design decisions that I want to try to explain here.</p>

      <p>0.5 seconds: I don't want to give time for people to be able to create a meaningful video</p>
      <p>Auto upload after record/no edit: This should be spontaneous, not planned at all</p>
      <p>Drop format: Keep people coming back to the site and make the archive better</p>

      <NextLink href="/contribute"><Button>Go make a video, seriously you should go do it right now</Button></NextLink>

      <footer>
        <p>Built by Benjamin Smith</p>
      </footer>
    </div>
  )
}
