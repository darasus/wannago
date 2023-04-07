import {DocumentArrowDownIcon} from '@heroicons/react/24/solid';
import {useEventId} from 'hooks';
import {trpc} from 'trpc/src/trpc';
import {Button} from 'ui';
import {saveAs} from 'file-saver';

export function ExportAttendeesCSV() {
  const {eventShortId} = useEventId();
  const {data, refetch, isLoading} = trpc.event.getAttendees.useQuery(
    {
      eventShortId: eventShortId!,
    },
    {
      enabled: !!eventShortId,
    }
  );

  const handleDownloadCsvClick = () => {
    const content =
      'First name,Last name,Email,Plus one,Status\r\n' +
      data
        ?.map(signUp => {
          return `${signUp.user.firstName},${signUp.user.lastName},${
            signUp.user.email
          },${signUp.hasPlusOne ? 'Yes' : 'No'},${signUp.status}`;
        })
        .join('\r\n')!;
    const blob = new Blob([content], {type: 'text/csv;charset=utf-8'});
    saveAs(blob, 'file.csv');
  };

  return (
    <Button
      variant="neutral"
      onClick={handleDownloadCsvClick}
      size="sm"
      iconLeft={<DocumentArrowDownIcon />}
      title={'Export CSV'}
      data-testid="export-csv-button"
    >
      Export CSV
    </Button>
  );
}
