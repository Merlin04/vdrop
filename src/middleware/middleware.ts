import nextConnect from "next-connect";
import multiparty from "multiparty";

const middleware = nextConnect();

middleware.use(async (req, res, next) => {
    const form = new multiparty.Form();

    await form.parse(req, (err, fields, files) => {
        //@ts-ignore
        req.body = fields;
        //@ts-ignore
        req.files = files;
        next();
    });
});

export default middleware;