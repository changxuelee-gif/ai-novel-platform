import { router } from "@/server/trpc";
import { novelRouter } from "./novel";
import { chapterRouter } from "./chapter";
import { userRouter } from "./user";
import { characterRouter } from "./character";
import { styleRouter } from "./style";
import { activityRouter } from "./activity";
import { interactionRouter } from "./interaction";
import { aiRouter } from "./ai";
import { creationRouter } from "./creation";
import { checkinRouter } from "./checkin";

export const appRouter = router({
  novel: novelRouter,
  chapter: chapterRouter,
  user: userRouter,
  character: characterRouter,
  style: styleRouter,
  activity: activityRouter,
  interaction: interactionRouter,
  ai: aiRouter,
  creation: creationRouter,
  checkin: checkinRouter,
});

export type AppRouter = typeof appRouter;
