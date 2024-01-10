// issue: https://github.com/diegomura/react-pdf/issues/2350
import {renderToBuffer} from '@joshuajaco/react-pdf-renderer-bundled';
import {TRPCError} from '@trpc/server';
import {prisma} from 'database';
import {NextRequest} from 'next/server';
import {invariant} from 'utils';
import {TicketPDF} from './components/TicketPDF';

export async function GET(
  req: NextRequest,
  {params}: {params: {ticketSaleId: string | undefined}}
) {
  invariant(
    typeof params.ticketSaleId === 'string',
    new TRPCError({
      code: 'BAD_REQUEST',
      message: 'ticketSaleId',
    })
  );

  try {
    const ticketSale = await prisma.ticketSale.findUnique({
      where: {
        id: params.ticketSaleId,
      },
      include: {
        event: true,
        ticket: true,
        user: true,
      },
    });

    invariant(ticketSale, new TRPCError({code: 'NOT_FOUND'}));

    const value = await renderToBuffer(<TicketPDF ticketSale={ticketSale} />);
    return new Response(value, {
      status: 200,
      headers: {'Content-Type': 'application/pdf'},
    });
  } catch (error) {
    console.error(error);
    return new Response('Something went wrong', {
      status: 400,
    });
  }
}
