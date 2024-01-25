import { TiInfo } from "react-icons/ti";
import Button from "~/components/button";
import Modal from "~/components/modal";
import { useChangeOrganizationStatus } from "~/mutations/organization";

type RejectModalProps = {
  open: boolean;
  onClose: () => void;
  data: Organization;
};

export default function RejectModal({ open, onClose, data }: RejectModalProps) {
  const changeOrganizationStatus = useChangeOrganizationStatus();

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
          Are you sure you want to reject this organization?
        </p>
        <div className="mt-10 flex gap-6 justify-between">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={changeOrganizationStatus.isLoading}
            onClick={async () => {
              const response = await changeOrganizationStatus.mutateAsync({
                id: data?.id || "",
                action: "reject",
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
