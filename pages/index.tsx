import NextLink from "next/link";
import { useEffect, useState } from "react";
import { getDayNumber, MS_IN_DAY, START_DATE } from "../src/date";
import Banner from "../src/ui/Banner";
import Button from '../src/ui/Button';
import Link from "../src/ui/Link";
import { styled } from "../src/ui/theme";

function dateTimeComponentToString(n: Number) {
  return n.toString().padStart(2, "0");
}

const LinkStyleAdder = styled(Link, {
  display: "none"
});

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
      {/* Weird glitch with makeStyles requires this so that the link and button root classes don't get the same identifier */}
      <LinkStyleAdder />
      <Banner>{timeUntilNextDrop} until next drop</Banner>
      <h1>VDrop</h1>
      <h2>Community-powered super-short daily video drops</h2>
      <h3>How it works:</h3>
      <ol>
        <li>Sign in with your ZephyrNet account</li>
        <li>Click record</li>
        <li>Do something for 1 second</li>
        <li>Your video will automatically upload, come back tomorrow to watch the drop you contributed to</li>
      </ol>

      {typeof window !== 'undefined' && window.location.protocol !== "https:" && (
        <h1>You're not using https, which probably will break video recording (it needs a secure context). Click <Link href="https://vdrop.zephyr">here to go to the https version</Link>.</h1>
      )}

      <NextLink href="/contribute"><Button>Let's go</Button></NextLink>

      {getDayNumber() > 1 && (
        <h2><NextLink href="/viewer" passHref><Link>Check out today's drop</Link></NextLink></h2>
      )}

      <h2>Why?</h2>

      <p>VDrop is an experiment to try to capture the general feel of Zephyr without any specific details. The daily video archives an aspect of the trip very apparent to everyone onboard but invisible to everyone else.</p>

      <h3>Justifications</h3>

      <p>I've made some odd design decisions that I want to try to explain here.</p>

      <p>1 second: I don't want to give time for people to be able to create a meaningful video</p>
      <p>Auto upload after record/no edit: This should be spontaneous, not planned at all</p>
      <p>Drop format: Keep people coming back to the site and make the archive better</p>

      <NextLink href="/contribute"><Button>Go make a video, seriously you should go do it right now</Button></NextLink>

      <footer>
        <p>Built by Benjamin Smith</p>
      </footer>
    </div>
  )
}
