"use client";

import { Event } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
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
} from "ui";
import { formatDate } from "utils";

const columnHelper = createColumnHelper<Event>();

const columns = [
  columnHelper.accessor("title", {
    cell: (info) => (
      <Link
        href={`/e/${info.row.original.shortId}`}
        className="underline"
        target={"_blank"}
      >
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor("shortId", {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("isPublished", {
    cell: (info) => (info.getValue() ? "Published" : "Draft"),
  }),
  columnHelper.accessor("createdAt", {
    cell: (info) => formatDate(info.getValue(), "dd MMM, HH:mm"),
  }),
];

interface EventsTableProps {
  events: Event[];
}

export function EventsTable({ events }: EventsTableProps) {
  const table = useReactTable({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Container maxSize="full">
      <div className="flex flex-col gap-4">
        <Button variant="outline" asChild>
          <Link href="/admin">
            <ArrowLeftCircle />
            Back to admin home
          </Link>
        </Button>
        <PageHeader title={"All events"} />
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
