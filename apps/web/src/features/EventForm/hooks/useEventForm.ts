'use client';

import {Event, Ticket, User} from '@prisma/client';
import {useForm} from 'react-hook-form';
import {useEffect} from 'react';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

export const eventFormSchema = z.object({
  createdById: z.string().default(''),
  title: z.string().default(''),
  description: z.string().optional(),
  featuredImageSrc: z.string().optional(),
  featuredImageHeight: z.number().optional(),
  featuredImageWidth: z.number().optional(),
  featuredImagePreviewSrc: z.string().optional(),
  startDate: z.date({
    required_error: 'Start date is required.',
  }),
  startTime: z.date({
    required_error: 'Start time is required.',
  }),
  endDate: z.date({
    required_error: 'End date is required.',
  }),
  endTime: z.date({
    required_error: 'End time is required.',
  }),
  address: z.string(),
  maxNumberOfAttendees: z.number().optional().default(0),
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
      title: event?.title,
      startDate: event?.startDate || new Date(),
      endDate: event?.endDate || new Date(),
      description: event?.description || undefined,
      address: event?.address || undefined,
      maxNumberOfAttendees: event?.maxNumberOfAttendees || undefined,
      featuredImageSrc: event?.featuredImageSrc || undefined,
      featuredImageHeight: event?.featuredImageHeight || undefined,
      featuredImageWidth: event?.featuredImageWidth || undefined,
      featuredImagePreviewSrc: event?.featuredImagePreviewSrc || undefined,
      tickets:
        event?.tickets?.map(ticket => {
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
