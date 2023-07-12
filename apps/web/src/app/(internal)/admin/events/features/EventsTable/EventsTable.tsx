'use client';

import {Event} from '@prisma/client';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {ChevronLeft} from 'lucide-react';
import Link from 'next/link';
import {
  Container,
  Button,
  PageHeader,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from 'ui';
import {formatDate} from 'utils';

const columnHelper = createColumnHelper<Event>();

const columns = [
  columnHelper.accessor('title', {
    header: 'Title',
    cell: (info) => (
      <Link
        href={`/e/${info.row.original.shortId}`}
        className="underline"
        target={'_blank'}
      >
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor('shortId', {
    header: 'Short ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('isPublished', {
    header: 'Published?',
    cell: (info) => (info.getValue() ? 'Published' : 'Draft'),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created at',
    cell: (info) => formatDate(info.getValue(), 'dd MMM, HH:mm'),
  }),
];

interface EventsTableProps {
  events: Event[];
}

export function EventsTable({events}: EventsTableProps) {
  const table = useReactTable({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Container maxSize="full">
      <div className="flex flex-col gap-4">
        <Button asChild>
          <Link href="/admin">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to admin home
          </Link>
        </Button>
        <PageHeader title={'All events'} />
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
