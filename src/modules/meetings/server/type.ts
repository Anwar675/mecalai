import { AppRouter } from "@/trpc/routes/_app";
import { inferRouterOutputs } from "@trpc/server";

export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"];
export type MeetingListItem =
  inferRouterOutputs<AppRouter>["meetings"]["getMany"]["items"][number];

export enum MeetingStatus {
  Upcoming = "upcoming",
  Active = "active",
  Completed = "completed",
  Processing = "processing",
  Cancelled = "cancelled"
}

export type StreamTranscriptItem = {
  speaker_id: string;
  type:string;
  text: string;
  start_ts: number;
  stop_ts: number
}