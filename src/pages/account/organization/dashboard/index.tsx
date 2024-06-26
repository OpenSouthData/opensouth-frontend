import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { GridColDef } from "@mui/x-data-grid";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import { IoCloudDownloadOutline, IoGridOutline } from "react-icons/io5";
import { AiOutlineEye } from "react-icons/ai";
import DataGrid from "~/components/data-grid";
import Button from "~/components/button";
import { useUserOrganizationDatasets } from "~/queries/dataset";
import MostAccessedDatasets from "./most-accessed-datasets";
import TopTrafficLocations from "./top-traffic-locations";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "NO.",
    minWidth: 10,
    renderCell: ({ api, row }) => {
      const { getAllRowIds } = api;

      return getAllRowIds().indexOf(row.id) + 1;
    },
  },
  {
    field: "title",
    headerName: "TITLE",
    flex: 1,
    minWidth: 200,
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
      return moment(value).fromNow();
    },
    sortComparator: (v1, v2) => {
      return new Date(v1).getTime() - new Date(v2).getTime();
    },
    align: "center",
    headerAlign: "center",
  },
  {
    field: "views",
    headerName: "VIEWS",
    flex: 1,
    minWidth: 70,
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
    minWidth: 70,
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
          <p className={twMerge(obj.styles, `text-orange-500 border border-orange-500`)}>Pending</p>
        );
      } else if (value === "published") {
        obj.element = (
          <p className={twMerge(obj.styles, `text-green-500 border border-green-500`)}>Published</p>
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

export default function Dashboard() {
  const { slug } = useParams();

  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const organization = queryClient.getQueryData<Organization>([`/organisations/${slug}/`]);

  const { data: datasets, isLoading: isDatasetsLoading } = useUserOrganizationDatasets(
    organization?.id || ""
  );

  return (
    <>
      <main className="p-6 px-8 pb-12 tablet:px-6 largeMobile:!px-4 gap-4 flex flex-col">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-medium flex items-center gap-2">
            Dashboard <span className="text-sm">{">"}</span>{" "}
            <span className="text-info-800">{organization?.name || "-----"}</span>
          </h1>
          <Button
            className="!py-2 !px-3 !text-xs"
            variant="outlined"
            onClick={() => {
              navigate(`/account/${slug}/edit`);
            }}
          >
            Edit
          </Button>
        </div>
        <div className="w-full border border-info-100 bg-white p-4 rounded-md">
          <div className="grid grid-cols-3 [@media(max-width:900px)]:grid-cols-2 [@media(max-width:650px)]:!grid-cols-1 gap-4   [&>div]:w-full [&>div]:rounded-md [&>div]:p-4 [&>div]:flex [&>div]:justify-between [&>div]:min-h-[9rem]   [&>div>div]:flex [&>div>div]:flex-col [&>div>div]:mt-2 [&>div>div]:gap-3   [&>div>div>p]:font-semibold [&>div>div>p]:text-sm [&>div>div>h1]:text-4xl [&>div>div>h1]:font-semibold">
            <div className="bg-red-50">
              <div>
                <p className="text-info-950">Datasets</p>
                <h1 className="text-neutral-800">{`${organization?.data_count ?? "--"}`}</h1>
              </div>
              <span className="p-2 border border-red-500 h-fit rounded text-red-500 text-base">
                <IoGridOutline />
              </span>
            </div>
            <div className="bg-purple-50">
              <div>
                <p className="text-info-950">Views</p>
                <h1 className="text-neutral-800">{organization?.views_count ?? "--"}</h1>
              </div>
              <span className="p-2 border border-purple-500 h-fit rounded text-purple-500 text-base">
                <AiOutlineEye />
              </span>
            </div>
            <div className="bg-lime-50">
              <div>
                <p className="text-info-950">Downloads</p>
                <h1 className="text-neutral-800">{`${organization?.downloads_count ?? "--"}`}</h1>
              </div>
              <span className="p-2 border border-lime-500 h-fit rounded text-lime-500 text-base">
                <IoCloudDownloadOutline />
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 tablet:grid-cols-1">
          <MostAccessedDatasets />
          <TopTrafficLocations />
        </div>
        <div className="w-full border border-info-100 bg-white p-4 rounded-md flex flex-col gap-4 py-5 pt-4">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-semibold text-info-950">Latest dataset created</h1>
            <div>
              <Button
                className="!py-2 !px-3 !text-xs"
                variant="outlined"
                onClick={() => {
                  navigate(`/account/${organization?.slug}/datasets`);
                }}
              >
                View All
              </Button>
            </div>
          </div>
          <div className="min-h-[500px]">
            <DataGrid
              rows={datasets ? datasets.results : []}
              loading={isDatasetsLoading}
              onRowClick={(params) => {
                navigate(`/account/${organization?.slug}/datasets/${params.id}`);
              }}
              getRowClassName={() => `cursor-pointer`}
              columns={columns}
              hideFooter
            />
          </div>
        </div>
      </main>
    </>
  );
}
