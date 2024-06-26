import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Avatar,
  ClickAwayListener,
  Fade,
  IconButton,
  MenuItem,
  OutlinedInput,
  Paper,
  Popper,
  Select,
  Tooltip,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { twMerge } from "tailwind-merge";
import { GoKebabHorizontal } from "react-icons/go";
import DataGrid from "~/components/data-grid";
import { useAdminOrganizations, useAdminOrganizationsIndicators } from "~/queries/organizations";
import ApproveConfirmationModal from "./status-confirmation-modals/approve";
import RejectConfirmationModal from "./status-confirmation-modals/reject";
import BlockConfirmationModal from "./active-confirmation-modals/block";
import UnblockConfirmationModal from "./active-confirmation-modals/unblock";
import DeleteConfirmationModal from "./delete-confirmation";
import useDebounce from "~/hooks/debounce";

type Modal = {
  open: boolean;
  data: Organization | null;
};

type QueryKey = "q" | "active" | "verified" | "status";

export default function Organization() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const queryParams = {
    get: (key: QueryKey) => searchParams.get(key) || "",
    delete: (key: QueryKey) => {
      setSearchParams((params) => {
        params.delete(key);

        return params;
      });
    },
    set: (key: QueryKey, value: string) => {
      setSearchParams(
        (params) => {
          params.set(key, value);

          return params;
        },
        {
          replace: true,
        }
      );
    },
  };

  const search = queryParams.get("q") || "";
  const isVerified = queryParams.get("verified") || "";
  const isActive = queryParams.get("active") || "";
  const status = queryParams.get("status") || "";

  const [approveModal, setApproveModal] = useState<Modal>({
    open: false,
    data: null,
  });
  const [rejectModal, setRejectModal] = useState<Modal>({
    open: false,
    data: null,
  });
  const [blockModal, setBlockModal] = useState<Modal>({
    open: false,
    data: null,
  });
  const [unblockModal, setUnblockModal] = useState<Modal>({
    open: false,
    data: null,
  });
  const [deleteModal, setDeleteModal] = useState<Modal>({
    open: false,
    data: null,
  });
  const [anchorElObj, setAnchorElObj] = useState<{ [key: string]: HTMLButtonElement | null }>({});
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
  });

  function dropdownDisplay(id: string) {
    return Boolean(anchorElObj[id]);
  }

  const paramsProp = {
    search: search,
    filter: {
      isActive,
      isVerified,
      status,
    },
  };

  const { data, isLoading } = useAdminOrganizations(
    useDebounce(search).trim(),
    {
      isVerified,
      isActive,
      status,
    },
    pagination
  );
  const { data: indicatorData } = useAdminOrganizationsIndicators();

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "NO.",
      minWidth: 100,
      renderCell: ({ api, row }) => {
        const { page, pageSize } = pagination;
        const { getAllRowIds } = api;

        return getAllRowIds().indexOf(row.id) + 1 + page * pageSize;
      },
    },
    {
      field: "logo_url",
      headerName: "",
      minWidth: 110,
      renderCell: (params) => {
        return (
          <Avatar className="mx-auto !bg-transparent">
            <img
              src={params.value}
              alt="organization picture"
              className="w-full h-full object-contain"
            />
          </Avatar>
        );
      },
      editable: false,
      filterable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "NAME",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "data_count",
      headerName: "DATASETS",
      minWidth: 150,
      valueFormatter: ({ value }) => {
        return value;
      },
      sortComparator: (v1, v2) => {
        return v1 - v2;
      },
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "views_count",
      headerName: "VIEWS",
      minWidth: 150,
      valueFormatter: ({ value }) => {
        return value;
      },
      sortComparator: (v1, v2) => {
        return v1 - v2;
      },
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "downloads_count",
      headerName: "DOWNLOADS",
      minWidth: 150,
      valueFormatter: ({ value }) => {
        return value;
      },
      sortComparator: (v1, v2) => {
        return v1 - v2;
      },
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "STATUS",
      minWidth: 180,
      flex: 1,
      renderCell: ({ value, row }) => {
        return (
          <Tooltip title={!row.is_verified && "Organization not verified"}>
            <Select
              className="w-[180px] !text-[0.85rem] !py-0 !px-0"
              value={value}
              disabled={!row.is_verified}
              onChange={async (e) => {
                const chosenValue = e.target.value;

                if (chosenValue === "pending") {
                  return;
                }

                if (chosenValue === value) {
                  return;
                }

                if (chosenValue === "rejected") {
                  setRejectModal({
                    open: true,
                    data: row,
                  });
                }

                if (chosenValue === "approved") {
                  setApproveModal({
                    open: true,
                    data: row,
                  });
                }
              }}
            >
              <MenuItem value="pending" className="!hidden">
                Pending
              </MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
            </Select>
          </Tooltip>
        );
      },
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "created_at",
      headerName: "CREATED AT",
      flex: 1,
      minWidth: 200,
      valueFormatter: ({ value }) => {
        return moment(value).format("Do MMM, YYYY");
      },
      sortComparator: (v1, v2) => {
        return new Date(v1).getTime() - new Date(v2).getTime();
      },
      align: "center",
      headerAlign: "center",
    },
    {
      field: "updated_at",
      headerName: "UPDATED AT",
      minWidth: 200,
      flex: 1,
      valueFormatter: ({ value }) => {
        const result = moment(value).fromNow();

        if (result === "a day ago") {
          return "Yesterday";
        }

        return result.charAt(0).toUpperCase() + result.slice(1);
      },
      sortComparator: (v1, v2) => {
        return new Date(v1).getTime() - new Date(v2).getTime();
      },
      align: "center",
      headerAlign: "center",
    },
    {
      field: "is_verified",
      headerName: "VERIFIED",
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
      headerName: "ACTION",
      width: 100,
      renderCell: ({ row }) => {
        const obj = anchorElObj[row.id];

        return (
          <>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setAnchorElObj((prev) => ({
                      ...prev,
                      [row.id]: obj ? null : e.currentTarget,
                    }));
                  }}
                >
                  <GoKebabHorizontal className="rotate-90" />
                </IconButton>
                <Popper transition open={dropdownDisplay(row.id)} anchorEl={obj} className="!mt-2">
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                      <Paper className="flex flex-col [&>button]:p-4 [&>button]:text-xs [&>button]:py-3 overflow-hidden relative divide-y !shadow">
                        <button
                          className="hover:bg-info-100"
                          onClick={() => {
                            navigate(`./${row.id}`);
                            setAnchorElObj((prev) => ({
                              ...prev,
                              [row.id]: null,
                            }));
                          }}
                        >
                          View
                        </button>
                        <button
                          className="hover:bg-info-100"
                          onClick={async () => {
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
                              [row.id]: null,
                            }));
                          }}
                        >
                          {row.is_active ? "Block" : "Unblock"}
                        </button>
                        <button
                          className="hover:bg-info-100"
                          onClick={() => {
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
          </>
        );
      },
      align: "center",
      headerAlign: "center",
      sortable: false,
    },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <main className="p-6 px-8 tablet:px-6 largeMobile:!px-4 pb-16 flex flex-col gap-6 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold largeMobile:text-xl">Organization</h1>
        </div>
        <div className="bg-white w-full border border-info-100 pb-8 rounded-md flex flex-col">
          <div className="flex flex-col">
            <div className="flex items-center gap-4 flex-wrap p-4 [&>div]:flex [&>div]:items-center [&>div]:gap-3 [&>div]:text-sm [&>div]:border [&>div]:rounded [&>div]:p-2 [&>div]:px-3 [&>div>*]:text-xs">
              <div className="border-orange-500 [&>*]:text-orange-500">
                <p>Pending</p>
                <span>{indicatorData?.pending || 0}</span>
              </div>
              <div className="border-blue-500 [&>*]:text-blue-500">
                <p>Approved</p>
                <span>{indicatorData?.approved || 0}</span>
              </div>
              <div className="border-red-500 [&>*]:text-red-500">
                <p>Rejected</p>
                <span>{indicatorData?.rejected || 0}</span>
              </div>
            </div>
            <div className="flex items-center border-y p-4 py-4 border-info-100">
              <div className="flex items-center gap-4 h-10 w-full">
                <OutlinedInput
                  placeholder="Search for name..."
                  value={search}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (!value) {
                      return queryParams.delete("q");
                    }

                    queryParams.set("q", value);
                  }}
                  className="w-[400px] tablet:w-[80%] [@media(max-width:500px)]:!w-full !h-full !text-sm"
                />
              </div>
            </div>
            <div className="flex w-full items-center border-b p-4 py-4 border-info-100">
              <div className="flex w-full items-center justify-end gap-4 h-10">
                <Select
                  className="w-[200px] !text-sm !py-0 !px-0 !h-full"
                  value={status || ""}
                  onChange={async (e) => {
                    const chosenValue = e.target.value;

                    if (!chosenValue) {
                      return queryParams.delete("status");
                    }

                    queryParams.set("status", chosenValue);
                  }}
                  displayEmpty
                >
                  <MenuItem value="" className="placeholder">
                    <span className="text-info-600">Filter by status</span>
                  </MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                </Select>
                <Select
                  className="w-[200px] !text-sm !py-0 !px-0 !h-full"
                  value={isVerified || ""}
                  onChange={async (e) => {
                    const chosenValue = e.target.value;

                    if (!chosenValue) {
                      return queryParams.delete("verified");
                    }

                    queryParams.set("verified", chosenValue);
                  }}
                  displayEmpty
                >
                  <MenuItem value="" className="placeholder">
                    <span className="text-info-600">Filter by verified</span>
                  </MenuItem>
                  <MenuItem value="true">True</MenuItem>
                  <MenuItem value="false">False</MenuItem>
                </Select>
                <Select
                  className="w-[200px] !text-sm !py-0 !px-0 !h-full"
                  value={isActive || ""}
                  onChange={async (e) => {
                    const chosenValue = e.target.value;

                    if (!chosenValue) {
                      return queryParams.delete("active");
                    }

                    queryParams.set("active", chosenValue);
                  }}
                  displayEmpty
                >
                  <MenuItem value="" className="placeholder">
                    <span className="text-info-600">Filter by active</span>
                  </MenuItem>
                  <MenuItem value="true">True</MenuItem>
                  <MenuItem value="false">False</MenuItem>
                </Select>
              </div>
            </div>
          </div>
          <div className="min-h-[500px] p-4">
            <DataGrid
              className="!border-info-150"
              rows={data ? data.results : []}
              loading={isLoading}
              columns={columns}
              onRowClick={(params) => {
                navigate(`./${params.id}`);
              }}
              getRowClassName={() => `cursor-pointer`}
              rowCount={data?.count || 0}
              paginationModel={pagination}
              onPaginationModelChange={({ page, pageSize }, { reason }) => {
                if (!reason) return;

                setPagination({
                  page,
                  pageSize,
                });
              }}
              paginationMode="server"
            />
          </div>
        </div>
      </main>
      <ApproveConfirmationModal
        open={approveModal.open}
        onClose={() => {
          setApproveModal({
            open: false,
            data: null,
          });
        }}
        data={approveModal.data as Organization}
        pagination={pagination}
        queryParams={paramsProp}
      />
      <RejectConfirmationModal
        open={rejectModal.open}
        onClose={() => {
          setRejectModal({
            open: false,
            data: null,
          });
        }}
        data={rejectModal.data as Organization}
        pagination={pagination}
        queryParams={paramsProp}
      />
      <BlockConfirmationModal
        open={blockModal.open}
        onClose={() => {
          setBlockModal({
            open: false,
            data: null,
          });
        }}
        data={blockModal.data as Organization}
        pagination={pagination}
        queryParams={paramsProp}
      />
      <UnblockConfirmationModal
        open={unblockModal.open}
        onClose={() => {
          setUnblockModal({
            open: false,
            data: null,
          });
        }}
        data={unblockModal.data as Organization}
        pagination={pagination}
        queryParams={paramsProp}
      />
      <DeleteConfirmationModal
        open={deleteModal.open}
        onClose={() => {
          setDeleteModal({
            open: false,
            data: null,
          });
        }}
        data={deleteModal.data as Organization}
        pagination={pagination}
        queryParams={paramsProp}
      />
    </>
  );
}
