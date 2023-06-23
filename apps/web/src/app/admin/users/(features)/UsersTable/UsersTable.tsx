'use client';

import {ArrowLeftCircleIcon} from '@heroicons/react/24/solid';
import {User} from '@prisma/client';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import Link from 'next/link';
import {
  Container,
  Button,
  PageHeader,
  Table,
  THead,
  TRow,
  Th,
  TBody,
  Td,
} from 'ui';
import {formatDate} from 'utils';

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor(row => row.firstName, {
    id: 'firstName',
    header: () => 'Name',
    cell: info => (
      <Link
        className="underline"
        href={`/u/${info.row.original.id}`}
      >{`${info.getValue()} ${info.row.original.lastName}`}</Link>
    ),
  }),
  columnHelper.accessor('createdAt', {
    cell: info => formatDate(info.getValue(), 'dd MMM, HH:mm'),
  }),
  columnHelper.accessor('email', {
    cell: info => info.renderValue(),
  }),
  columnHelper.accessor('id', {
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('externalId', {
    cell: info => info.renderValue(),
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
        <Button
          variant="neutral"
          iconLeft={<ArrowLeftCircleIcon />}
          href="/admin"
          as="a"
        >
          Back to admin home
        </Button>
        <PageHeader title={'All users'} />
        <Table>
          <THead>
            {table.getHeaderGroups().map(headerGroup => (
              <TRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </Th>
                ))}
              </TRow>
            ))}
          </THead>
          <TBody>
            {table.getRowModel().rows.map(row => (
              <TRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </TRow>
            ))}
          </TBody>
        </Table>
      </div>
    </Container>
  );
}
