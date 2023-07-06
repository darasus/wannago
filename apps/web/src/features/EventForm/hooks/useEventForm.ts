'use client';

import {Event, Ticket, User} from '@prisma/client';
import {useForm} from 'react-hook-form';
import {useEffect} from 'react';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {parseISO} from 'date-fns';

export const eventFormSchema = z.object({
  createdById: z.string(),
  title: z.string(),
  description: z.string().optional(),
  featuredImageSrc: z.string().nullable().optional(),
  featuredImageHeight: z.number().nullable().optional(),
  featuredImageWidth: z.number().nullable().optional(),
  featuredImagePreviewSrc: z.string().nullable().optional(),
  startDate: z.date({
    required_error: 'Start date is required.',
  }),
  endDate: z.date({
    required_error: 'End date is required.',
  }),
  address: z.string(),
  maxNumberOfAttendees: z.string().optional().default('0'),
  tickets: z
    .array(
      z.object({
        id: z.string().optional(),
        title: z.string(),
        description: z.string().optional(),
        price: z.string(),
        maxQuantity: z.string(),
      })
    )
    .optional(),
});

export function useEventForm(props: {
  event?: (Event & {tickets: Ticket[]}) | null;
  me: User;
}) {
  const {event} = props || {};
  const createdByIdDefault =
    event?.userId || event?.organizationId || props.me.id;

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: event?.title || '',
      startDate:
        (typeof event?.startDate === 'string'
          ? parseISO(event?.startDate)
          : event?.startDate) || new Date(),
      endDate:
        (typeof event?.endDate === 'string'
          ? parseISO(event?.endDate)
          : event?.endDate) || new Date(),
      description: event?.description || undefined,
      address: event?.address || undefined,
      maxNumberOfAttendees: event?.maxNumberOfAttendees
        ? String(event?.maxNumberOfAttendees)
        : '0',
      featuredImageSrc: event?.featuredImageSrc || undefined,
      featuredImageHeight: event?.featuredImageHeight || undefined,
      featuredImageWidth: event?.featuredImageWidth || undefined,
      featuredImagePreviewSrc: event?.featuredImagePreviewSrc || undefined,
      tickets:
        event?.tickets?.map((ticket) => {
          return {
            id: ticket.id,
            title: ticket.title,
            description: ticket.description || undefined,
            price: (ticket.price / 100).toString(),
            maxQuantity: ticket.maxQuantity.toString(),
          };
        }) || [],
      createdById: createdByIdDefault,
    },
  });

  const createdByIdValue = form.watch('createdById');

  useEffect(() => {
    if (!createdByIdValue && createdByIdDefault) {
      form.setValue('createdById', createdByIdDefault);
    }
  }, [createdByIdDefault, createdByIdValue, form]);

  return form;
}
