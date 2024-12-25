/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { columns } from "./columns";
import { fetchUsers } from "@/utils/fetchUser";
import { Loader2 } from "lucide-react";


const TableComponent = () => {
    const { data: users = [], isLoading, isError } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
    });

    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 5,
    });

    const [globalFilter, setGlobalFilter] = React.useState("");

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
            globalFilter,
        },
    });

    const handleGlobalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGlobalFilter(e.target.value);
    };

    if (isError) return <div>Error fetching data</div>;

    return (
        <div>
            <div className="flex gap-4 items-center mb-4">
                <Input
                    value={globalFilter}
                    onChange={handleGlobalSearch}
                    placeholder="Search here"
                    className="w-full sm:w-3/4 md:w-1/2 lg:w-1/4"
                />
                {table.getColumn("name")?.getCanFilter() && (
                    <NameFilter column={table.getColumn("name")} />
                )}
            </div>

            <Table>
                <TableCaption>A list of users.</TableCaption>
                <TableHeader>
                    <TableRow>
                        {table.getHeaderGroups().map((headerGroup) =>
                            headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="text-left">
                                    <div
                                        {...{
                                            className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                                            onClick: header.column.getToggleSortingHandler(),
                                        }}
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {{
                                            asc: ' 🔼',
                                            desc: ' 🔽',
                                        }[header.column.getIsSorted() as string] ?? null}
                                    </div>
                                </TableHead>
                            ))
                        )}
                    </TableRow>
                </TableHeader>
                {isLoading ?
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center">
                                <div className="flex justify-center items-center space-x-2">
                                    <Loader2 className="animate-spin text-black-600 h-8 w-8" />
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody> :
                    users.length <= 0 ?
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    No data found
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        : (
                            <TableBody>
                                {table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="text-left">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        )}
            </Table>

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
                <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount().toLocaleString()}
                    </strong>
                </span>
                <div>
                    <Button
                        className="border rounded p-1"
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<<'}
                    </Button>
                    <Button
                        className="border rounded p-1"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </Button>
                    <Button
                        className="border rounded p-1"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>'}
                    </Button>
                    <Button
                        className="border rounded p-1"
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>>'}
                    </Button>
                </div>


                {/* <span className="flex items-center gap-1">
                    | Go to page:
                    <Input
                        type="number"
                        min="1"
                        max={table.getPageCount()}
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }}
                        className="border p-1 rounded w-16"
                    />
                </span> */}

                {/* <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                >
                    {[2, 5, 8, 10].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select> */}
            </div>
        </div>
    );
};

function NameFilter({ column }: { column: any }) {
    const columnFilterValue = column.getFilterValue();

    return (
        <Input
            value={columnFilterValue || ""}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder="Filter by name"
            className="w-full sm:w-3/4 md:w-1/2 lg:w-1/4"
        />
    );
}

export default TableComponent;
