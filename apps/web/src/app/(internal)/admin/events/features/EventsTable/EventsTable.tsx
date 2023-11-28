'use client';

import {Event} from '@prisma/client';
import {
  ColumnDef,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {ChevronLeft} from 'lucide-react';
import Link from 'next/link';
import {Container, Button, PageHeader} from 'ui';
import {formatDate} from 'utils';
import {AdminTable} from '../../../features/AdminTable/AdminTable';

const columnHelper = createColumnHelper<Event>();

const columns: ColumnDef<Event>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: (info) => (
      <Link
        href={`/e/${info.row.original.shortId}`}
        className="underline"
        target={'_blank'}
      >
        {info.getValue() as string}
      </Link>
    ),
  },
  {
    accessorKey: 'isPublished',
    header: 'Published?',
    cell: (info) => (info.getValue() ? 'Published' : 'Draft'),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created at',
    cell: (info) => formatDate(info.getValue() as Date, 'dd MMM, HH:mm'),
  },
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
        <AdminTable table={table} columns={columns} />
      </div>
    </Container>
  );
}
