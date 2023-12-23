'use client';

import {User} from '@prisma/client';
import {useReactTable, getCoreRowModel, ColumnDef} from '@tanstack/react-table';
import {ChevronLeft} from 'lucide-react';
import Link from 'next/link';
import {Container, Button, PageHeader} from 'ui';
import {AdminTable} from '../../../features/AdminTable/AdminTable';
import {formatDate} from 'utils';

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'id',
    cell: (info) => info.renderValue(),
  },
  {
    accessorKey: 'firstName',
    header: () => 'firstName',
    cell: (info) => (
      <Link
        className="underline"
        href={`/u/${info.row.original.id}`}
      >{`${info.getValue()} ${info.row.original.lastName}`}</Link>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'createdAt',
    cell: (info) => formatDate(info.getValue() as Date, 'dd MMM, HH:mm'),
  },
  {
    accessorKey: 'email',
    header: 'email',
    cell: (info) => info.renderValue(),
  },
];

interface UsersTableProps {
  users: User[];
}

export function UsersTable({users}: UsersTableProps) {
  const table = useReactTable({
    data: users || [],
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
        <PageHeader title={'All users'} />
        <AdminTable table={table} columns={columns} />
      </div>
    </Container>
  );
}
