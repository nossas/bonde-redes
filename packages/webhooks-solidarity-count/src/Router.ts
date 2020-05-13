import Express from "express";
import * as yup from "yup";
import dbg from "./dbg";
import App from "./App";

const log = dbg.extend("app");

const JSONErrorHandler = (
  err: Error,
  _: Express.Request,
  res: Express.Response,
  __: Express.NextFunction
) => {
  if (err instanceof SyntaxError) {
    log(err);
    res.status(400).json("Falha de sintaxe, objeto JSON inválido!");
  }
};

const getTicketIdFromRequest = async (req: Express.Request) => {
  const {
    ticket: { id }
  } = await yup
    .object()
    .shape({
      ticket: yup.object().shape({
        id: yup.string().required()
      })
    })
    .validate(req.body);

  return id;
};

const Router = () =>
  Express()
    .use(Express.json())
    .use(JSONErrorHandler)
    .post("/", async (req, res) => {
      try {
        const id = await getTicketIdFromRequest(req);
        log(`incoming request with id '${id}'`);
        return App(id, res);
      } catch (e) {
        log(e);
        return res.status(400).json("Corpo inválido da requisição");
      }
    });

export default Router;
