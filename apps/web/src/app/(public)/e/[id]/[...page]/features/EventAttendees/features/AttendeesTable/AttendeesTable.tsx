'use client';

import {use, useState} from 'react';
import {CaretSortIcon} from '@radix-ui/react-icons';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {Button, ColoredBadge} from 'ui';
import {Input} from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui';
import {EventRegistrationStatus} from '@prisma/client';
import {MessageParticipantsButton} from '../MessageParticipantsButton/MessageParticipantsButton';
import {ExportAttendeesCSV} from '../ExportAttendeesCSV/ExportAttendeesCSV';
import {InviteButton} from '../InviteButton/InviteButton';
import {RouterOutputs} from 'api';
import {ActionsButton} from './features/ActionsButton/ActionsButton';

export type Item = {
  id: string;
  fullName: string;
  email: string;
  status: EventRegistrationStatus;
  eventShortId: string;
  userId: string;
};

interface Props {
  event: RouterOutputs['event']['getByShortId'];
  getAttendeesPromise: Promise<Item[]>;
  getAllEventsAttendeesPromise: Promise<
    RouterOutputs['event']['getAllEventsAttendees']
  >;
}

export function AttendeesTable({
  event,
  getAllEventsAttendeesPromise,
  getAttendeesPromise,
}: Props) {
  const data = use(getAttendeesPromise);
  const columns: ColumnDef<Item>[] = [
    {
      accessorKey: 'fullName',
      header: ({column}) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({row}) => (
        <div className="lowercase">{row.getValue('fullName')}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({row}) => <div className="lowercase">{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({row}) => (
        <ColoredBadge color="default">{row.getValue('status')}</ColoredBadge>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({row}) => {
        return (
          <ActionsButton
            eventShortId={row.original.eventShortId}
            fullName={row.original.fullName}
            userId={row.original.userId}
            status={row.original.status}
          />
        );
      },
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

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
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <Input
          placeholder="Filter names..."
          value={
            (table.getColumn('fullName')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('fullName')?.setFilterValue(event.target.value)
          }
        />
        <div className="flex items-center gap-2 w-full shrink-0 sm:shrink">
          <MessageParticipantsButton />
          <ExportAttendeesCSV event={event} />
          <InviteButton
            eventShortId={event.shortId}
            getAllEventsAttendeesPromise={getAllEventsAttendeesPromise}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
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
    </div>
  );
}
