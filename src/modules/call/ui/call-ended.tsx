"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
interface Props {
  meetingId: string;
}

export const CallEnded = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<"like" | "dislike" | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const router = useRouter();
  const { mutate: createFeedback, isPending } = useMutation(
    trpc.meetings.gettingFeedBack.mutationOptions({
      onSuccess: () => {
        router.push("/dashboard/meetings");
      },
    }),
  );

  const handleSelectRating = (value: "like" | "dislike") => {
    setRating(value);
  };

  const handleSubmitFeedback = () => {
    if (!rating) return;

    createFeedback({
      meetingId,
      type: "summary",
      rating,
      feedback: feedbackText,
    });
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-radial from-sidebar-accent to-sidebar">
      <div className="py-4 px-8 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-6  bg-background rounded-xl p-10 shadow-sm">
          <div className="flex flex-col gap-y-2 text-center ">
            <h6 className="tex-2xl font-bold">You have ended the call</h6>
            <p className="text-sm">Summary will appear in a few minutes. </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => handleSelectRating("like")}
              disabled={isPending}
              className="px-2"
            >
              👍 Like
            </Button>

            <Button
              className="px-2"
              onClick={() => handleSelectRating("dislike")}
              disabled={isPending}
            >
              👎 Dislike
            </Button>
          </div>
          <p>
            Bạn có thể góp thêm ý kiến{" "}
            <span
              onClick={() => setIsOpen(true)}
              className=" cursor-pointer text-custom underline"
            >
              tại đây
            </span>
          </p>
          {isOpen && (
            <div className="w-full flex flex-col gap-3">
              <Textarea
                placeholder="Nhập góp ý của bạn..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />

              <Button
                onClick={handleSubmitFeedback}
                disabled={!rating || isPending}
              >
                {isPending ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          )}
          <Button variant="custom" className="py-2">
            <Link href="/dashboard/meetings">Back to meetings</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
