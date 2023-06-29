"use client";

import { Organization } from "@prisma/client";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
  Button,
  Container,
  PageHeader,
  TBody,
  THead,
  TRow,
  Table,
  Td,
  Th,
} from "ui";

const columnHelper = createColumnHelper<Organization>();

const columns = [
  columnHelper.accessor((row) => row.name, {
    id: "Name",
    header: () => "Name",
    cell: (info) => (
      <Link className="underline" href={`/o/${info.row.original.id}`}>
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor("email", {
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
  }),
];

interface OrganizationsTableProps {
  organizations: Organization[];
}

export function OrganizationsTable({ organizations }: OrganizationsTableProps) {
  const table = useReactTable({
    data: organizations,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Container maxSize="full">
      <div className="flex flex-col gap-4">
        <Button variant="outline" asChild>
          <Link href="/admin">
            <ChevronLeft />
            Back to admin home
          </Link>
        </Button>
        <PageHeader title={"All organizations"} />
        <Table>
          <THead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
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
            {table.getRowModel().rows.map((row) => (
              <TRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
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
