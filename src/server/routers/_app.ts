import { router } from "@/server/trpc";
import { novelRouter } from "./novel";
import { chapterRouter } from "./chapter";
import { userRouter } from "./user";
import { characterRouter } from "./character";
import { styleRouter } from "./style";
import { activityRouter } from "./activity";
import { interactionRouter } from "./interaction";
import { aiRouter } from "./ai";

export const appRouter = router({
  novel: novelRouter,
  chapter: chapterRouter,
  user: userRouter,
  character: characterRouter,
  style: styleRouter,
  activity: activityRouter,
  interaction: interactionRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
