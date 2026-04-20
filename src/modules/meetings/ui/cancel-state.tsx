
import { EmptyState } from "../../../components/empty-state";


export const CancelState =() => {
  return (
    <div className="bg-[#D8E3EB] border-4 border-white rounded-lg px-4 py-5  flex flex-col gap-y-8 justify-center items-center">
      <EmptyState
        image="/cancelled.svg"
        title="Meeting cancelled"
        description="This meeting was cancelled"
      />
      
    </div>
  );
};
