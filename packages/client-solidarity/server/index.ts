import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import body_parser from "body-parser";
import all from "./all";
import individuals from "./individuals";
import forward from "./forward";
import volunteersAvailable from "./volunteersAvailable";
import locations from "./locations";
import user from "./user";

const asyncMiddleware = fn => (
  req: express.Request,
  res: express.Response,
  next
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const app = express();
const port = process.env.PORT;

app.use(body_parser.json());
app.use(
  body_parser.urlencoded({
    extended: true
  })
);

app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'
  )
);
app.use(cors());
app.use(express.static(path.join(__dirname, "..", "..", "build")));
app.use((err, _req: express.Request, res: express.Response, _next) => {
  console.error(err);
  res.status(500).json({ message: "an error occurred" });
});

app.get("/api/all", asyncMiddleware(all));
app.get("/api/individuals", asyncMiddleware(individuals));
app.get("/api/volunteers", asyncMiddleware(volunteersAvailable));
app.get("/api/locations", asyncMiddleware(locations));
app.get("/api/user", asyncMiddleware(user));

app.post("/api/forward", asyncMiddleware(forward));

app.get("/*", (_req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, "..", "..", "build", "index.html"));
});

app.listen(port, () =>
  console.log(`Match Voluntarios App listening on port ${port}!`)
);

// export default app
