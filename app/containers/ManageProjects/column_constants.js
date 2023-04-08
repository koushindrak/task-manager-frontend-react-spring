import {GridColDef, GridValueGetterParams} from "@mui/x-data-grid";
import React from "react";

export const columns1: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 150,resizable:true,align:"center"},
  { field: 'description', headerName: 'Description', width: 200 },
  {
    field: 'startDate',
    headerName: 'Start Date',
    description: 'This column has a value getter and is not sortable.',
    sortable: true,
    filterable: true,
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      `${new Date(params.row.startDate).toLocaleString('en-US')}`
  }
];
