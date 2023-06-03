import {DocumentArrowDownIcon} from '@heroicons/react/24/solid';
import {useEventId, useEventQuery} from 'hooks';
import {trpc} from 'trpc/src/trpc';
import {Button} from 'ui';
import {saveAs} from 'file-saver';
import {toast} from 'react-hot-toast';
import {snakeCase} from 'change-case';

export function ExportAttendeesCSV() {
  const {eventShortId} = useEventId();
  const {data} = useEventQuery({eventShortId});
  const generateEventCsvData = trpc.event.generateEventCsvData.useMutation();

  const handleDownloadCsvClick = async () => {
    const content = await generateEventCsvData.mutateAsync({
      eventShortId: eventShortId!,
    });
    if (!content || !data?.title) {
      toast.error('Error generating CSV file, please try again later.');
      return;
    }
    const blob = new Blob([content], {type: 'text/csv;charset=utf-8'});
    saveAs(blob, `${snakeCase(data?.title)}.csv`);
  };

  return (
    <Button
      variant="neutral"
      onClick={handleDownloadCsvClick}
      size="sm"
      iconLeft={<DocumentArrowDownIcon />}
      title={'Export CSV'}
      data-testid="export-csv-button"
      isLoading={generateEventCsvData.isLoading}
    >
      Export CSV
    </Button>
  );
}
