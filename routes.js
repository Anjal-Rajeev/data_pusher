import { Router } from "express";
const app = Router();

import account from "./routes/account.router.js"
import destination from "./routes/destination.router.js"
import webhook from "./routes/webhook.router.js"


app.get("/", (req, res) => res.send("Server Running 🚀"));

app.use("/account", account)
app.use("/destination", destination)
app.use("/server", webhook)


export default app;