'use client';

import {Organization} from '@prisma/client';
import {useReactTable, getCoreRowModel, ColumnDef} from '@tanstack/react-table';
import {ChevronLeft} from 'lucide-react';
import Link from 'next/link';
import {Button, Container, PageHeader} from 'ui';
import {AdminTable} from '../../../features/AdminTable/AdminTable';

const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: 'id',
    header: 'id',
    cell: (info) => info.renderValue(),
  },
  {
    accessorKey: 'name',
    header: () => 'name',
    cell: (info) => (
      <Link className="underline" href={`/o/${info.row.original.id}`}>
        {info.getValue() as string}
      </Link>
    ),
  },
  {
    accessorKey: 'email',
    header: () => 'email',
    cell: (info) => info.renderValue(),
  },
];

interface OrganizationsTableProps {
  organizations: Organization[];
}

export function OrganizationsTable({organizations}: OrganizationsTableProps) {
  const table = useReactTable({
    data: organizations || [],
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
        <PageHeader title={'All organizations'} />
        <AdminTable table={table} columns={columns} />
      </div>
    </Container>
  );
}
