import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import { ArrowUpDown, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type StudentPivot = {
  status: 'submitted' | 'pending' | 'missing';
  file?: string | null;
  turned_in_at?: string | null;
};

type Student = {
  id: number;
  name: string;
  pivot: StudentPivot;
};

type PageProps = {
  subtask: {
    id: number;
    title: string;
    due_date: string | null;
  };
  students: Student[];
};

export default function StudentSubmission() {
  const { subtask, students } = usePage<PageProps>().props;

  // Convert student data into table rows
  const data = students.map((student) => ({
    id: student.id,
    subtask_id: subtask.id, 
    name: student.name,
    due_date: subtask.due_date
      ? new Date(subtask.due_date).toLocaleString()
      : "No due date",
    submitted_at: student.pivot.turned_in_at
      ? new Date(student.pivot.turned_in_at).toLocaleString()
      : "—",
    status: student.pivot.status,
    file: student.pivot.file,
  }));

  const columns: ColumnDef<typeof data[0]>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Student Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium ml-3">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }) => row.getValue("due_date"),
    },
    {
      accessorKey: "submitted_at",
      header: "Submitted At",
      cell: ({ row }) => row.getValue("submitted_at"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        return (
          <span
            className={
              status === "submitted"
                ? "text-green-600 font-semibold"
                : status === "missing"
                ? "text-red-600 font-semibold"
                : "text-gray-600"
            }
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "file",
      header: "File",
      cell: ({ row }) =>
        row.original.file ? (
          <a href={`/storage/${row.original.file}`} target="_blank">
            <Button size="sm" variant="outline">View</Button>
          </a>
        ) : (
          "—"
        ),
    },
    {
      id: "comment",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => router.visit(`/sub-task/${row.original.subtask_id}/comment`)}
        >
          Comment
        </Button>
      ),
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <AppLayout>
      <Head title={"Submissions: " + subtask.title} />

      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">{subtask.title} – Submissions</h1>

        {/* FILTER + COLUMN TOGGLE */}
        <div className="flex items-center py-4">
          <Input
            placeholder="Search student..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("name")?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                    className="capitalize"
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    No submissions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
