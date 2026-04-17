
import Image from "next/image";

interface Props {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: Props) => {
  return (
    <div className=" flex my-auto flex-1 justify-center items-center">
      <div className="flex flex-col items-center justify-center gap-y-6 bg-[#D8E3EB] rounded-lg py-10">
        <Image width={240} height={240} src="/img/empty.svg" alt="Empty State" />
        <div className="max-w-md text-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};
