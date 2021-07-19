import nextConnect from "next-connect";
import middleware from "../../src/middleware/middleware";
import fs from "fs";
import util from "util";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { getDayNumber } from "../../src/date";

if(!process.env.NEXT_PRIVATE_UPLOADS_DIR)
    throw new Error("process.env.NEXT_PRIVATE_UPLOADS_DIR is undefined");

const rename = util.promisify(fs.rename);
const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);
handler.post(async (req, res) => {
    const dayDir = path.join(process.env.NEXT_PRIVATE_UPLOADS_DIR as string, Math.ceil(getDayNumber()).toString());
    if(!(await exists(dayDir))) {
        await mkdir(dayDir);
    }
    await rename(
        //@ts-expect-error
        req.files.video[0].path,
        path.join(
            dayDir,
            // TODO: no path traversal
            req.body.name[0]
        )
    );
    res.send("Success");
});

export const config = {
    api: {
        bodyParser: false
    }
};

export default handler;