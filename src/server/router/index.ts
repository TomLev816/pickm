// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { teamRouter } from "./teams";
import { protectedExRouter } from "./protected-example-router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("teams.", teamRouter)
  .merge("auth.", protectedExRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
