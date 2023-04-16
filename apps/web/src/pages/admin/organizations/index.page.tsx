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
import {Organization} from '@prisma/client';
import {withProtected} from '../../../utils/withAuthProtect';
import {ArrowLeftCircleIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';

const columnHelper = createColumnHelper<Organization>();

const columns = [
  columnHelper.accessor(row => row.name, {
    id: 'Name',
    header: () => 'Name',
    cell: info => (
      <Link className="underline" href={`/o/${info.row.original.id}`}>
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor('email', {
    cell: info => info.renderValue(),
  }),
  columnHelper.accessor('id', {
    cell: info => info.getValue(),
  }),
];

function AdminPage() {
  const {data} = trpc.admin.getAllOrganizations.useQuery();

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
        <PageHeader title={'All organizations'} />
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
