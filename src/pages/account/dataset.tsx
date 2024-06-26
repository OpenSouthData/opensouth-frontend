import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuItem, OutlinedInput, Select } from "@mui/material";
import { twMerge } from "tailwind-merge";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import DataGrid from "~/components/data-grid";
import { useUserDatasets } from "~/queries/dataset";
import useDebounce from "~/hooks/debounce";

export default function Dataset() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [filterBy, setFilterBy] = useState<{
    status: "pending" | "rejected" | "published" | "further_review" | "unpublished" | null;
  }>({
    status: null,
  });

  const { data, isLoading } = useUserDatasets(
    useDebounce(search).trim(),
    {
      status: filterBy.status as string,
    },
    {
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
    }
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "NO.",
      minWidth: 10,
      renderCell: ({ api, row }) => {
        const { page, pageSize } = paginationModel;
        const { getAllRowIds } = api;

        return getAllRowIds().indexOf(row.id) + 1 + page * pageSize;
      },
    },
    {
      field: "title",
      headerName: "TITLE",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "views",
      headerName: "VIEWS",
      flex: 1,
      minWidth: 100,
      valueFormatter: ({ value }) => {
        return value.count;
      },
      sortComparator: (v1, v2) => {
        return v1 - v2.count;
      },
      align: "center",
      headerAlign: "center",
    },
    {
      field: "files_count",
      headerName: "FILES",
      minWidth: 100,
      valueFormatter: ({ value }) => {
        return value;
      },
      sortComparator: (v1, v2) => {
        return v1 - v2;
      },
      align: "center",
      headerAlign: "center",
    },
    {
      field: "created_at",
      headerName: "CREATED AT",
      flex: 1,
      minWidth: 150,
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
      minWidth: 150,
      flex: 1,
      valueFormatter: ({ value }) => {
        const date = moment(value).fromNow();

        return date.charAt(0).toUpperCase() + date.slice(1);
      },
      sortComparator: (v1, v2) => {
        return new Date(v1).getTime() - new Date(v2).getTime();
      },
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ value }) => {
        const obj: {
          element: any;
          styles: string;
        } = {
          element: "-------",
          styles: "py-1 px-2 rounded-full text-xs",
        };

        if (value === "pending") {
          obj.element = (
            <p className={twMerge(obj.styles, `text-orange-500 border border-orange-500`)}>
              Pending
            </p>
          );
        } else if (value === "published") {
          obj.element = (
            <p className={twMerge(obj.styles, `text-green-500 border border-green-500`)}>
              Published
            </p>
          );
        } else if (value === "unpublished") {
          obj.element = (
            <p className={twMerge(obj.styles, `text-info-800 border border-info-800`)}>
              Unpublished
            </p>
          );
        } else if (value === "rejected") {
          obj.element = (
            <p className={twMerge(obj.styles, `text-red-500 border border-red-500`)}>Rejected</p>
          );
        } else if (value === "further_review") {
          obj.element = (
            <p className={twMerge(obj.styles, `text-info-800 border border-info-800`)}>
              Further Review
            </p>
          );
        }

        return obj.element;
      },
      sortable: false,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <>
      <main className="p-6 px-8 tablet:px-6 largeMobile:!px-4 pb-16 flex flex-col gap-6 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold largeMobile:text-xl">Datasets</h1>
        </div>
        <div className="bg-white w-full border border-info-100 pb-8 rounded-md flex flex-col">
          <div className="flex items-center border-y p-4 py-4 border-info-100">
            <div className="flex items-center gap-4 h-10 w-full">
              <OutlinedInput
                placeholder="Search for title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[400px] tablet:w-[80%] [@media(max-width:500px)]:!w-full !h-full !text-sm"
              />
              <Select
                className="w-[200px] !text-sm !py-0 !px-0 !h-full"
                value={filterBy.status || ""}
                onChange={async (e) => {
                  const chosenValue = e.target.value;

                  setFilterBy((prev) => ({
                    ...prev,
                    status: chosenValue as typeof filterBy.status,
                  }));
                }}
                displayEmpty
              >
                <MenuItem value="" className="placeholder">
                  <span className="text-info-600">Filter by status</span>
                </MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="unpublished">Unpublished</MenuItem>
                <MenuItem value="further_review">Further Review</MenuItem>
              </Select>
            </div>
          </div>
          <div className="min-h-[500px] p-4">
            <DataGrid
              rows={data ? data.results : []}
              loading={isLoading}
              onRowClick={(params) => {
                navigate(`./${params.id}`);
              }}
              getRowClassName={() => `cursor-pointer`}
              columns={columns}
              rowCount={data?.count || 0}
              paginationModel={paginationModel}
              onPaginationModelChange={({ page, pageSize }, { reason }) => {
                if (!reason) return;

                setPaginationModel({
                  page,
                  pageSize,
                });
              }}
              paginationMode="server"
            />
          </div>
        </div>
      </main>
    </>
  );
}
