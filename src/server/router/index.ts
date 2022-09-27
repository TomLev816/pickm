// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { helloRouter } from "./hello";
import { protectedExRouter } from "./protected-example-router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("hello.", helloRouter)
  .merge("auth.", protectedExRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
