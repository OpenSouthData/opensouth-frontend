import { TiInfo } from "react-icons/ti";
import Button from "~/components/button";
import Modal from "~/components/modal";
import { useChangeDatasetStatus } from "~/mutations/dataset";

type UnpublishModalProps = {
  open: boolean;
  onClose: () => void;
  data: Dataset;
  pagination: Pagination;
  queryParams: {
    search: string;
    filter: {
      status: string;
    };
  };
};

export default function UnpublishModal({
  open,
  onClose,
  data,
  pagination,
  queryParams,
}: UnpublishModalProps) {
  const changeDatasetStatus = useChangeDatasetStatus(pagination, queryParams);

  return (
    <Modal
      muiModal={{
        open,
        onClose,
      }}
    >
      <div className="flex flex-col gap-3 mediumMobile:gap-1 py-2">
        <span className="bg-red-100 mb-3 w-fit rounded-md p-4 mx-auto">
          <TiInfo className="text-red-400 p-2 !text-[4rem] mediumMobile:!text-[3.5rem] !font-extralight" />
        </span>
        <p className="text-base largeMobile:!text-sm font-medium text-center">
          Are you sure you want unpublish this dataset?
        </p>
        <div className="mt-10 flex gap-6 justify-between">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={changeDatasetStatus.isLoading}
            onClick={async () => {
              const response = await changeDatasetStatus.mutateAsync({
                id: data?.id || "",
                action: "unpublished",
              });

              if (response) {
                onClose();
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
