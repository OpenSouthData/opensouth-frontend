import { MdDeleteOutline } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Button from "~/components/button";
import Modal from "~/components/modal";
import { useDeleteDataset } from "~/mutations/dataset";

type DeleteConfirmationProps = {
  open: boolean;
  setOpen: (bool: boolean) => void;
};

export default function DeleteConfirmation({ open, setOpen }: DeleteConfirmationProps) {
  const navigate = useNavigate();

  const { id } = useParams();

  const deleteDataset = useDeleteDataset();

  function onClose() {
    setOpen(false);
  }

  return (
    <Modal
      muiModal={{
        open,
        onClose,
      }}
    >
      <div className="flex flex-col gap-3 mediumMobile:gap-1">
        <span className="bg-red-100 mb-3 w-fit rounded-md p-4 mx-auto">
          <MdDeleteOutline className="text-red-400 p-2 !text-[4rem] mediumMobile:!text-[3rem] !font-extralight" />
        </span>
        <h1 className="text-base largeMobile:!text-sm font-medium text-center">
          Are you sure you want to delete this dataset?
        </h1>
        <div className="mt-10 flex gap-6 justify-between">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={deleteDataset.isLoading}
            onClick={async () => {
              const response = await deleteDataset.mutateAsync(id || "");

              if (response) {
                navigate("/account/datasets");
              }
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
}
