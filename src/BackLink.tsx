import NextLink from "next/link";
import Link from "./ui/Link";

export default function BackLink() {
    return (
        <NextLink href="/" passHref>
            <Link>Back to home page</Link>
        </NextLink>
    );
}
