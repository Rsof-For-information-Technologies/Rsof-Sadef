"use client"

import {
    ColumnDef, SortingState, getSortedRowModel, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, Table as T_Table,
    Row,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/shadCn/ui/table"
import React, { MouseEvent, useEffect, useState } from "react"
import cn from "@/utils/class-names"

interface DataTableProps<TData extends { id: string }, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]

    tableTopComp?: (table: T_Table<TData>) => React.ReactNode;
    tableBottomComp?: (table: T_Table<TData>) => React.ReactNode;

    tableWrappedTopComp?: (table: T_Table<TData>) => React.ReactNode;
    tableWrappedBottomComp?: (table: T_Table<TData>) => React.ReactNode;

    wrapper?: (children: React.ReactNode) => React.ReactNode;

    children?: (table: T_Table<TData>) => React.ReactNode;

    showSerialNumber?: boolean;

    onRowClick?: (e: MouseEvent<HTMLTableRowElement, MouseEvent>, row: Row<TData>) => any
    rowClassName?: string;

    onSelectedIdsChange?: (selectedIds: string[]) => void
}

export function DataTable<TData extends { id: string }, TValue>({
    columns,
    data,
    onSelectedIdsChange,
    children,
    wrapper,
    tableWrappedTopComp,
    tableWrappedBottomComp,
    tableTopComp,
    tableBottomComp,
    showSerialNumber,
    onRowClick,
    rowClassName
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = useState<SortingState>([])
    const [mounted, setMounted] = useState(false)
    const [rowSelection, setRowSelection] = useState({})

    useEffect(() => {
        setMounted(true);

        return () => {
            setMounted(false);
        };
    }, []);

    const table = useReactTable({
        data,
        columns,

        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            rowSelection,
            pagination: {
                pageSize: data?.length,
                pageIndex: 0,
            }
        },

    })

    // Extract selected row IDs and notify parent
    useEffect(() => {
        if (table) {
            const selectedIds = table.getSelectedRowModel().flatRows.map((row) => row.original.id);
            if (onSelectedIdsChange) {
                onSelectedIdsChange(selectedIds);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelection, table]);

    if (mounted === false) return null

    return (
        <>
            {tableTopComp ? tableTopComp(table) : null}
            {
                wrapper

                    ? wrapper(<TableComp<TData, TValue>
                        table={table}
                        columns={columns}
                        onRowClick={onRowClick}
                        tableWrappedTopComp={tableWrappedTopComp}
                        tableWrappedBottomComp={tableWrappedBottomComp}
                        showSerialNumber={showSerialNumber}
                        rowClassName={rowClassName}
                    />)

                    : <TableComp<TData, TValue> table={table} columns={columns} showSerialNumber={showSerialNumber} />
            }

            {tableBottomComp ? tableBottomComp(table) : null}

            {children ? children(table) : null}
        </>
    )
}


interface TableComp<TData, TValue> {
    table: T_Table<TData>,
    columns: ColumnDef<TData, TValue>[]
    tableWrappedTopComp?: (table: T_Table<TData>) => React.ReactNode;
    tableWrappedBottomComp?: (table: T_Table<TData>) => React.ReactNode;
    showSerialNumber?: boolean;
    onRowClick?: (e: MouseEvent<HTMLTableRowElement, MouseEvent>, row: Row<TData>) => any
    rowClassName?: string;
}

function TableComp<TData, TValue>({ table, columns, tableWrappedTopComp, tableWrappedBottomComp, showSerialNumber, onRowClick, rowClassName }: TableComp<TData, TValue>) {
    return (
        <>
            {tableWrappedTopComp ? tableWrappedTopComp(table) : null}
            <Table >
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => {
                        return (
                            <TableRow className={cn("dark:bg-[#1f1f1f] bg-[#f1f1f1]")} key={headerGroup.id}>
                                {
                                    showSerialNumber
                                        ? <th className=" pl-2 text-xs font-bold dark:text-[#929292] text-gray-500">Sr. #</th>
                                        : null
                                }

                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead className="text-xs font-bold dark:text-[#929292] text-gray-500" key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        )
                    })}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length
                        ? (
                            table.getRowModel().rows.map((row, index) => {

                                return (
                                    <TableRow
                                        onClick={(e) => onRowClick ? onRowClick(e as any, row) : null}
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className={cn(rowClassName)}
                                    >
                                        {
                                            showSerialNumber
                                                ? <td className="text-center"><p>{index + 1}</p></td>
                                                : null
                                        }

                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="min-h-[1px] h-[1px]">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            })
                        )

                        : (
                            <TableRow>
                                <TableCell
                                    colSpan={showSerialNumber ? columns.length + 1 : columns.length}
                                    className="h-24 text-center"
                                >
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
            {tableWrappedBottomComp ? tableWrappedBottomComp(table) : null}
        </>
    )
}
