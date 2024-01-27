import { useEffect, useState } from "react";
import {
  Avatar,
  ClickAwayListener,
  Fade,
  IconButton,
  OutlinedInput,
  Paper,
  Popper,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { IoPerson } from "react-icons/io5";
import { GoKebabHorizontal } from "react-icons/go";
import moment from "moment";
import { twMerge } from "tailwind-merge";
import DataGrid from "~/components/data-grid";
import { useGetAllUsers } from "~/queries/user";
import BlockConfirmationModal from "./confirmation-modals/block";
import DeleteConfirmationModal from "./confirmation-modals/delete";
import UnblockConfirmationModal from "./confirmation-modals/unblock";

type Modal = {
  open: boolean;
  data: CurrentUser | null;
};

export default function User() {
  const [anchorElObj, setAnchorElObj] = useState<{ [key: string]: HTMLButtonElement | null }>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [blockModal, setBlockModal] = useState<Modal>({
    open: false,
    data: null,
  });
  const [deleteModal, setDeleteModal] = useState<Modal>({
    open: false,
    data: null,
  });
  const [unblockModal, setUnblockModal] = useState<Modal>({
    open: false,
    data: null,
  });

  function dropdownDisplay(id: string) {
    return Boolean(anchorElObj[id]);
  }

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "NO.",
      minWidth: 100,
      renderCell: ({ api, row }) => {
        const { getAllRowIds } = api;

        return getAllRowIds().indexOf(row.id) + 1;
      },
    },
    {
      field: "image_url",
      headerName: "",
      minWidth: 40,
      renderCell: (params) => {
        return (
          <Avatar sx={{ width: 40, height: 40 }} className="mx-auto">
            {params.value ? (
              <img
                src={params.value}
                alt="profile picture"
                className="w-full h-full object-cover"
              />
            ) : (
              <IoPerson className={"text-base"} />
            )}
          </Avatar>
        );
      },
      editable: false,
      filterable: false,
      sortable: false,
    },
    {
      field: "first_name",
      headerName: "First Name",
      minWidth: 150,
      type: "string",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "last_name",
      headerName: "Last Name",
      minWidth: 150,
      type: "string",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 300,
      type: "string",
      renderCell: (params) => {
        return (
          <a
            className="hover:underline hover:text-primary-600 text-center whitespace-nowrap"
            href={`mailto:${params.value}`}
          >
            {params.value}
          </a>
        );
      },
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "date_joined",
      headerName: "Date Joined",
      minWidth: 150,
      type: "string",
      renderCell: (params) => {
        return <p>{moment(params.value).format("MMMM D, YYYY")}</p>;
      },
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "is_active",
      headerName: "ACTIVE",
      minWidth: 100,
      flex: 1,
      renderCell: ({ value }) => {
        const obj: {
          element: any;
          styles: string;
        } = {
          element: "-------",
          styles: "py-1 px-2 rounded-full text-xs",
        };

        if (value === true) {
          obj.element = (
            <p className={twMerge(obj.styles, `text-green-500 border border-green-500`)}>True</p>
          );
        } else if (value === false) {
          obj.element = (
            <p className={twMerge(obj.styles, `text-amber-500 border border-amber-500`)}>False</p>
          );
        }

        return obj.element;
      },
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "_",
      headerName: "Action",
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => {
        const obj = anchorElObj[row.id];

        return (
          <ClickAwayListener
            onClickAway={() =>
              setAnchorElObj((prev) => ({
                ...prev,
                [row.id]: null,
              }))
            }
          >
            <div>
              <IconButton
                size="small"
                onClick={(e) =>
                  setAnchorElObj((prev) => ({
                    ...prev,
                    [row.id]: obj ? null : e.currentTarget,
                  }))
                }
              >
                <GoKebabHorizontal className="rotate-90" />
              </IconButton>
              <Popper transition open={dropdownDisplay(row.id)} anchorEl={obj} className="!mt-2">
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={200}>
                    <Paper className="flex flex-col [&>button]:p-4 [&>button]:text-sm [&>button]:py-3 overflow-hidden relative divide-y !shadow">
                      <button
                        className="hover:bg-info-100"
                        onClick={(e) => {
                          if (row.is_active) {
                            setBlockModal({
                              open: true,
                              data: row,
                            });
                          } else {
                            setUnblockModal({
                              open: true,
                              data: row,
                            });
                          }

                          setAnchorElObj((prev) => ({
                            ...prev,
                            [row.id]: obj ? null : e.currentTarget,
                          }));
                        }}
                      >
                        Block
                      </button>
                      <button
                        className="hover:bg-info-100"
                        onClick={async () => {
                          setDeleteModal({
                            open: true,
                            data: row,
                          });

                          setAnchorElObj((prev) => ({
                            ...prev,
                            [row.id]: null,
                          }));
                        }}
                      >
                        Delete
                      </button>
                    </Paper>
                  </Fade>
                )}
              </Popper>
            </div>
          </ClickAwayListener>
        );
      },
      sortable: false,
    },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const { isLoading, data } = useGetAllUsers(pageSize, page);

  return (
    <>
      <main className="p-6 px-8 tablet:px-6 largeMobile:!px-4 pb-16 flex flex-col gap-8 w-full">
        <header className="flex items-center gap-8 justify-between w-full">
          <h1 className="text-2xl largeMobile:text-xl font-semibold">Users</h1>
        </header>
        <div className="flex flex-col gap-4">
          <OutlinedInput
            placeholder="Search..."
            className="w-[500px] tablet:w-[80%] [@media(max-width:500px)]:!w-full self-end"
          />
          <div className="min-h-[500px]">
            <DataGrid
              loading={isLoading}
              rows={data ? data.results : []}
              columns={columns}
              rowCount={data?.count}
              onPaginationModelChange={({ page, pageSize }) => {
                setPage(page);
                setPageSize(pageSize);
              }}
              initialState={{
                pagination: {
                  paginationModel: {
                    page,
                    pageSize,
                  },
                },
              }}
            />
          </div>
        </div>
      </main>
      <BlockConfirmationModal
        open={blockModal.open}
        onClose={() => {
          setBlockModal({
            open: false,
            data: null,
          });
        }}
        data={blockModal.data as CurrentUser}
      />
      <DeleteConfirmationModal
        open={deleteModal.open}
        onClose={() => {
          setDeleteModal({
            open: false,
            data: null,
          });
        }}
        data={deleteModal.data as CurrentUser}
      />
      <UnblockConfirmationModal
        open={unblockModal.open}
        onClose={() => {
          setUnblockModal({
            open: false,
            data: null,
          });
        }}
        data={unblockModal.data as CurrentUser}
      />
    </>
  );
}
