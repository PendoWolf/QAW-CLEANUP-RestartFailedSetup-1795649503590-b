import * as pendo from "pendo-server-sdk";
import { createApp } from "./app.js";

// Pendo Agent Analytics: traces the Tripwise Assistant's Anthropic calls. Set PENDO_DISABLED=true to turn it off.
pendo.init({
  apiKey: "14ff918d-35df-4fe8-be74-f8e8c0f4d3e2",
  agentId: "4HKRnzdg5EmyN6oS0OrfLYWbes4",
  endpoint: "https://app.pendo-dev.pendo-dev.com",
  autoPatch: true,
});

const port = Number(process.env.PORT) || 3001;
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

const server = createApp(corsOrigin).listen(port, () => {
  console.log(`Tripwise API on port ${port}, allowing ${corsOrigin}`);
});

// Send any buffered Pendo events before the process stops.
server.on("close", () => {
  void pendo.shutdown();
});
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, async () => {
    await pendo.shutdown();
    process.exit(0);
  });
}
