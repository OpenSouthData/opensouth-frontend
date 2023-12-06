import { Link } from "react-router-dom";
import { OutlinedInput } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import moment from "moment";
import data from "~/utils/data/dataset.json";
import DataGrid from "~/components/data-grid";

export default function Dataset() {
  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      minWidth: 300,
    },
    { field: "createdAt", headerName: "Created at", width: 150 },
    {
      field: "updatedAt",
      headerName: "Updated at",
      width: 150,
      valueFormatter: (params) => {
        return moment(params.value).fromNow();
      },
      sortComparator: (v1, v2) => {
        return new Date(v1).getTime() - new Date(v2).getTime();
      },
      type: "string",
    },
    {
      field: "createdBy",
      headerName: "Created by",
      width: 300,
      valueGetter: (params) => {
        const { organization, user } = params.row;

        return organization ? organization.name : `${user.firstName} ${user.lastName}`;
      },
      renderCell: (params: GridRenderCellParams<any, typeof data>) => {
        const { organization, user } = params.row;

        return organization ? (
          <Link
            className="text-primary-600 capitalize hover:underline relative z-10"
            to={`/organizations/${organization.slug}`}
          >
            {organization.name}
          </Link>
        ) : user ? (
          <span className="capitalize">{`${user.firstName} ${user.lastName}`}</span>
        ) : (
          "-------"
        );
      },
      type: "string",
    },
  ];

  return (
    <>
      <main className="p-6 px-8 tablet:px-6 largeMobile:!px-4 pb-16 flex flex-col gap-8 w-full">
        <header className="flex items-center gap-8 justify-between w-full">
          <h1 className="text-2xl largeMobile:text-xl font-semibold">Datasets</h1>
        </header>
        <div className="flex flex-col gap-4">
          <OutlinedInput
            placeholder="Search..."
            className="w-[500px] tablet:w-[80%] [@media(max-width:500px)]:!w-full self-end"
          />
          <div className="min-h-[500px]">
            <DataGrid
              rows={data.map((item, index) => {
                const { title, organization, user, updatedAt } = item;

                return {
                  id: index + 1,
                  title,
                  createdAt: moment(Date.now()).format("Do MMM, YYYY"),
                  updatedAt,
                  organization,
                  user,
                };
              })}
              columns={columns}
            />
          </div>
        </div>
      </main>
    </>
  );
}
