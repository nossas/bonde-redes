import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import body_parser from "body-parser";
import {
  individuals,
  forward,
  volunteersAvailable,
  locations,
  user,
  all
} from "./components";

const asyncMiddleware = fn => (
  req: express.Request,
  res: express.Response,
  next
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const app = express();
const port = Number(process.env.PORT) || 5000;
const host = process.env.HOST || "localhost";

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
app.use(express.static(path.join(__dirname, "..", "src", "client", "build")));
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
  res.sendFile(
    path.join(__dirname, "..", "src", "client", "build", "index.html")
  );
});

app.listen(port, host, () =>
  console.log(`Match Voluntarios App listening on port ${port}!`)
);

// export default app
