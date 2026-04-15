import { Loader2Icon } from "lucide-react";

interface Props {
  title: string;
  description: string;
}

export const LoadingState = ({ title, description }: Props) => {
  return (
    <div className="py-4 px-8 flex h-full flex-1 justify-center items-center">
      <div className="flex flex-col items-center justify-center gap-y-6 bg-white rounded-lg p-10 shadow-sm">
        <Loader2Icon className="size-10 animate-spin text-custom" />
        <div className="text-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};
