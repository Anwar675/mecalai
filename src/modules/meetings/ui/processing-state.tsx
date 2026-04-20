
import { EmptyState } from "../../../components/empty-state";


export const ProcessingState =() => {
  return (
    <div className="bg-[#D8E3EB] border-4 border-white rounded-lg px-4 py-5  flex flex-col gap-y-8 justify-center items-center">
      <EmptyState
        image="/processing.svg"
        title="Meeting is active"
        description="This meeting was completed, a summary will appear soon "
      />
      
    </div>
  );
};
