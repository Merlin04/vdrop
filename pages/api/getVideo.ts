import { NextApiRequest, NextApiResponse } from "next";

import mmmagic from "mmmagic";
import fs from "fs";
import path from "path";
import util from "util";
import { getDayNumber } from "../../src/date";

import "core-js/features/array/at";

const stat = util.promisify(fs.stat);
const magic = new mmmagic.Magic(mmmagic.MAGIC_MIME_TYPE);
const getMimeType = (path: string) => new Promise<string>(resolve => {
    magic.detectFile(path, (err, result) => {
        if(err) throw err;
        resolve(Array.isArray(result) ? result[0] : result);
    });
});

export async function resFile(path: string, res: NextApiResponse) {
    const fileStat = await stat(path);
    res.writeHead(200, {
        "Content-Type": await getMimeType(path),
        "Content-Length": fileStat.size
    });

    const stream = fs.createReadStream(path);

    await new Promise(resolve => {
        stream.pipe(res);
        stream.on('end', resolve);
    });
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const requestPathStr = path.join(
        process.env.NEXT_PRIVATE_UPLOADS_DIR as string,
        path.normalize(req.query["path"] as string)
    );
    const requestPath = path.parse(requestPathStr);

    if (Number(requestPath.dir.split(path.sep)
        //@ts-expect-error
        .at(-1))
        >= getDayNumber()) {
        res.statusCode = 403;
        res.send("You can't get videos for current or future days");
    }

    res.statusCode = 200;
    await resFile(requestPathStr, res);
}