import { NextApiRequest, NextApiResponse } from "next";
import { getDayNumber } from "../../src/date";
import { resFile } from "./getVideo";

import fs from "fs";
import path from "path";
import child_process from "child_process";
import util from "util";

import "core-js/features/string/replace-all";

const exists = util.promisify(fs.exists);
const readDir = util.promisify(fs.readdir);
const copyFile = util.promisify(fs.copyFile);
const exec = util.promisify(child_process.exec);

const rendering: string[] = [];
const error404s: string[] = [];

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const day = req.query["day"] as string;
    if (Number(day) >= getDayNumber()) {
        res.statusCode = 403;
        res.send("You can't get drops for current or future days");
    }

    const vidPath = path.join(process.env.NEXT_PRIVATE_UPLOADS_DIR as string, "drops", day + ".mp4");
    console.log(error404s);
    if(!error404s.includes(day) && (!(await exists(vidPath)) || rendering.includes(day))) {
        // 202 Accepted
        res.statusCode = 202;
        res.send("Rendering video");
        res.end();
        console.log("sent response");
        if(!rendering.includes(day)) {
            console.log("rerendering day");
            const i = rendering.push(day) - 1;
            try {
                await renderVideo(day);
            } catch(err) {
                console.log("Pushing to 404");
                error404s.push(day);
            }
            rendering.splice(i, 1);
            console.log("done rendering");
        }
    }
    else if(error404s.includes(day)) {
        console.log("is 404");
        res.statusCode = 204;
        res.end();
    }
    else {
        res.statusCode = 200;
        await resFile(vidPath, res);
    }
}

async function renderVideo(day: string) {
    const inputFilesDir = path.join(process.env.NEXT_PRIVATE_UPLOADS_DIR as string, day);
    const readFilesDir = await readDir(inputFilesDir);
    const outputPath = path.join(process.env.NEXT_PRIVATE_UPLOADS_DIR as string, "drops", day + ".mp4");

    if(readFilesDir.length === 0) {
        throw new Error("There are no videos to render for that day");
    }
    else if(readFilesDir.length === 1) {
        await copyFile(path.join(inputFilesDir, readFilesDir[0]), outputPath);
    }
    else {
        const input = readFilesDir.map(file => "-i \"" + path.join(inputFilesDir, file).replaceAll("\"", "\\\"") + "\"");
        //const out = await exec(`ffmpeg -protocol_whitelist file,pipe -f concat ${input} -c copy ${path.join(process.env.NEXT_PRIVATE_UPLOADS_DIR as string, "drops", day + ".mp4")}`);
        const out = await exec(`ffmpeg ${input.join(" ")} -filter_complex "${input.map((_, i) => `[${i}:v] [${i}:a]`).join(" ")} concat=n=${input.length}:v=1:a=1 [v] [a]" -map "[v]" -map "[a]" ${outputPath}`);
        //console.log(out);
    }
}