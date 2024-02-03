'use client';

import {useTransition} from 'react';
import {RouterOutputs} from 'api';
import {snakeCase} from 'change-case';
import {saveAs} from 'file-saver';
import {useParams} from 'next/navigation';
import {toast} from 'sonner';
import {Button} from 'ui';

import {api} from '../../../../../../../../../trpc/client';

interface Props {
  event: RouterOutputs['event']['getByShortId'];
}

export function ExportAttendeesCSV({event}: Props) {
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const eventShortId = params?.id as string;

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
      className="shrink-0"
    >
      Export CSV
    </Button>
  );
}
