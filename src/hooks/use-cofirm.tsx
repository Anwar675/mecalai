import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { JSX, useState } from "react";

export const useConfirm = (
  title: string,
  description: string,
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  const hanldeClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    hanldeClose();
  };
  const handleCancel = () => {
    promise?.resolve(false);
    hanldeClose();
  };

  const confirmationDialog = () => (
    <ResponsiveDialog
      open={promise !== null}
      onOpenChange={hanldeClose}
      title={title}
      description={description}
    >
      <div className="pt-4 w-full flex justify-end  flex-row-reverse gap-y-2 lg:flex-row gap-x-2 items-center">
        <Button onClick={handleCancel} variant="custom" className="py-2 outline-none bg-white text-black border-zinc-500 ">Cancel</Button>
        <Button onClick={handleConfirm} variant="custom" className="">Confirm</Button>
      </div>
    </ResponsiveDialog>
  );
  return [confirmationDialog,confirm]
};
