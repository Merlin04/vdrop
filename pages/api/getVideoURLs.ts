// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import util from "util";

const readDir = util.promisify(fs.readdir);

export default async (req: NextApiRequest, 
    res: NextApiResponse) => {
    const requestDay = req.query["day"];
    if(!requestDay || Array.isArray(requestDay)) {
        res.statusCode = 400;
        res.send("You must provide a day parameter");
        return;
    }
    /*if(Number(requestDay) >= getDayNumber()) {
        res.statusCode = 403;
        res.send("You can't get videos for current or future days");
        return;
    }*/
// TODO: fix path thing
    const files = await readDir(path.join(process.env.NEXT_PRIVATE_UPLOADS_DIR as string, requestDay));

    res.statusCode = 200;
    res.json(files);
}