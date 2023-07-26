'use client';

import {Button} from 'ui';
import {saveAs} from 'file-saver';
import {toast} from 'sonner';
import {snakeCase} from 'change-case';
import {useParams} from 'next/navigation';
import {use, useTransition} from 'react';
import {api} from '../../../../../../../../trpc/client';

export function ExportAttendeesCSV() {
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const eventShortId = params?.id as string;
  const event = use(api.event.getByShortId.query({id: eventShortId}));

  const handleDownloadCsvClick = () => {
    startTransition(async () => {
      const content = await api.event.generateEventCsvData.query({
        eventShortId: eventShortId!,
      });
      if (!content || !event?.title) {
        toast.error('Error generating CSV file, please try again later.');
        return;
      }
      const blob = new Blob([content], {type: 'text/csv;charset=utf-8'});
      saveAs(blob, `${snakeCase(event?.title)}.csv`);
    });
  };

  return (
    <Button
      onClick={handleDownloadCsvClick}
      size="sm"
      title={'Export CSV'}
      data-testid="export-csv-button"
      disabled={isPending}
      isLoading={isPending}
    >
      Export CSV
    </Button>
  );
}
