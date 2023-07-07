import {renderToBuffer} from '@react-pdf/renderer';
import {TRPCError} from '@trpc/server';
import {prisma} from 'database';
import {NextApiRequest, NextApiResponse} from 'next';
import {invariant} from 'utils';
import {TicketPDF} from '../../../../app/(components)/pdf/TicketPDF';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    typeof req.query.ticketSaleId === 'string',
    new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Missing id query',
    })
  );

  const ticketSale = await prisma.ticketSale.findUnique({
    where: {
      id: req.query.ticketSaleId as string,
    },
    include: {
      event: {
        include: {
          organization: true,
          user: true,
        },
      },
      ticket: true,
      user: true,
    },
  });

  invariant(ticketSale, new TRPCError({code: 'NOT_FOUND'}));

  const value = await renderToBuffer(<TicketPDF ticketSale={ticketSale} />);

  res.setHeader('Content-Type', 'application/pdf');
  return res.status(200).send(value);
}
