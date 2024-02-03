'use client';

import {Event, EventSignUp} from '@prisma/client';
import {ColumnDef, getCoreRowModel, useReactTable} from '@tanstack/react-table';
import {ChevronLeft} from 'lucide-react';
import Link from 'next/link';
import {Button, Container, PageHeader} from 'ui';
import {formatDate} from 'utils';

import {AdminTable} from '../../../features/AdminTable/AdminTable';

type Item = EventSignUp & {event: Event};

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: 'id',
    header: 'id',
    cell: (info) => info.renderValue(),
  },
  {
    accessorKey: 'createdAt',
    header: 'createdAt',
    cell: (info) => formatDate(info.getValue() as Date, 'dd MMM, HH:mm'),
  },
  {
    accessorKey: 'eventId',
    header: 'eventId',
    cell: (info) => (
      <Link
        className="underline"
        href={`/e/${info.row.original.event.shortId}`}
      >{`${info.getValue()}`}</Link>
    ),
  },
];

interface SignUpsTableProps {
  signUps: Item[];
}

export function SignUpsTable({signUps}: SignUpsTableProps) {
  const table = useReactTable({
    data: signUps || [],
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
        <PageHeader title={'All event sign ups'} />
        <AdminTable table={table} columns={columns} />
      </div>
    </Container>
  );
}
