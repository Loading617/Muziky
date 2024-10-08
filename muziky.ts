import { Application } from "@sveltejs/kit";
import { createServer } from "@sveltejs/kit/server";

import { handle } from "./routes/api/+server";

const app = new Application();

app.use(handle);

export default createServer(app);
