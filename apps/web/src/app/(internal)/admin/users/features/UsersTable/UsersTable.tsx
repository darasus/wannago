'use client';

import {User} from '@prisma/client';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import {ChevronLeft} from 'lucide-react';
import Link from 'next/link';
import {
  Container,
  Button,
  PageHeader,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from 'ui';
import {formatDate} from 'utils';

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor((row) => row.firstName, {
    id: 'firstName',
    header: () => 'Name',
    cell: (info) => (
      <Link
        className="underline"
        href={`/u/${info.row.original.id}`}
      >{`${info.getValue()} ${info.row.original.lastName}`}</Link>
    ),
  }),
  columnHelper.accessor('createdAt', {
    cell: (info) => formatDate(info.getValue(), 'dd MMM, HH:mm'),
  }),
  columnHelper.accessor('email', {
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
  }),
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

  if (!users) {
    return null;
  }

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
