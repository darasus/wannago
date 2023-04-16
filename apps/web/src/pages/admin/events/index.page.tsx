import {
  Container,
  Td,
  Th,
  THead,
  TRow,
  Table,
  TBody,
  Button,
  PageHeader,
} from 'ui';
import {trpc} from 'trpc/src/trpc';
import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
} from '@tanstack/react-table';
import {Event} from '@prisma/client';
import {formatDate} from 'utils';
import {withProtected} from '../../../utils/withAuthProtect';
import Link from 'next/link';
import {ArrowLeftCircleIcon} from '@heroicons/react/24/outline';

const columnHelper = createColumnHelper<Event>();

const columns = [
  columnHelper.accessor('title', {
    cell: info => (
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
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('isPublished', {
    cell: info => (info.getValue() ? 'Published' : 'Draft'),
  }),
  columnHelper.accessor('createdAt', {
    cell: info => formatDate(info.getValue(), 'dd MMM, HH:mm'),
  }),
];

function AdminPage() {
  const {data} = trpc.admin.getAllEvents.useQuery();

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data) {
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
        <PageHeader title={'All events'} />
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

export default withProtected(AdminPage);
