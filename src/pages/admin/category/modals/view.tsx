import { DialogContent, DialogTitle } from "@mui/material";
import { useTranslation } from "react-i18next";
import Modal from "~/components/modal";

type ViewProps = {
  modal: CategoyModal;
  setModal: (obj: CategoyModal) => void;
};

export default function View({ modal, setModal }: ViewProps) {
  const { data, state } = modal;

  const { t } = useTranslation("dashboard-layout/admin/categories");

  return (
    <Modal
      open={state === "view"}
      onClose={() => {
        setModal({
          state: null,
          data: null,
        });
      }}
      exitIcon={{
        display: true,
      }}
    >
      <DialogTitle>{t("view-category-modal.title")}</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-4">
          <div className="w-full bg-primary-50">
            <figure className="flex justify-center items-center mx-auto w-full aspect-video max-h-[16rem] largeMobile:w-[80%]">
              <img
                src={data?.image_url || ""}
                alt="category image"
                className="w-full h-full object-contain"
              />
            </figure>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold largeMobile:text-sm px-8 [@media(max-width:500px)]:px-4">
              {data?.name || "------"}
            </h3>
            <p className="text-sm largeMobile:text-xs px-8 [@media(max-width:500px)]:px-4">
              {data?.description || "------"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Modal>
  );
}
