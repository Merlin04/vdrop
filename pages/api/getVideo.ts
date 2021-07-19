import { NextApiRequest, NextApiResponse } from "next";

import mmmagic from "mmmagic";
import fs from "fs";
import path from "path";
import util from "util";
import { getDayNumber } from "../../src/date";

import "core-js/features/array/at";

const stat = util.promisify(fs.stat);
const getMimeType = util.promisify((new mmmagic.Magic(mmmagic.MAGIC_MIME_TYPE)).detectFile);

async function resFile(path: string, res: NextApiResponse) {
    const fileStat = await stat(path);
    res.writeHead(200, {
        "Content-Type": await getMimeType(path),
        "Content-Length": fileStat.size
    });

    fs.createReadStream(path).pipe(res);
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const requestPathStr = path.join(
        process.env.NEXT_PRIVATE_UPLOADS_DIR as string,
        path.normalize(req.body["path"])
    );
    const requestPath = path.parse(requestPathStr);

    if (requestPath.dir.split(path.sep)
        //@ts-expect-error
        .at(-1)
        >= getDayNumber()) {
        res.statusCode = 403;
        res.send("You can't get videos for current or future days");
    }

    res.statusCode = 200;
    await resFile(requestPath.toString(), res);
}