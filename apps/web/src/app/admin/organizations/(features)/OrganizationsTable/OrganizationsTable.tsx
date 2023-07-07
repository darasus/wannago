'use client';

import {Organization} from '@prisma/client';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import {ChevronLeft} from 'lucide-react';
import Link from 'next/link';
import {
  Button,
  Container,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui';

const columnHelper = createColumnHelper<Organization>();

const columns = [
  columnHelper.accessor((row) => row.name, {
    id: 'Name',
    header: () => 'Name',
    cell: (info) => (
      <Link className="underline" href={`/o/${info.row.original.id}`}>
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor('email', {
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
  }),
];

interface OrganizationsTableProps {
  organizations: Organization[];
}

export function OrganizationsTable({organizations}: OrganizationsTableProps) {
  const table = useReactTable({
    data: organizations,
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
