import { AppRouter } from "@/trpc/routes/_app";
import { inferRouterOutputs } from "@trpc/server";

export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"];
export type MeetingListItem =
  inferRouterOutputs<AppRouter>["meetings"]["getMany"]["items"][number];
