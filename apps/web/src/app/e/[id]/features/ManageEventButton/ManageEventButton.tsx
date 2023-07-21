'use client';

import {RouterOutputs} from 'api';
import {usePublishEvent, useRemoveEvent, useUnpublishEvent} from 'hooks';
import {
  ChevronDown,
  DownloadCloud,
  Edit,
  Info,
  Trash2,
  UploadCloud,
  Users,
} from 'lucide-react';
import {useParams, useRouter} from 'next/navigation';
import {use} from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'ui';

interface Props {
  eventPromise: Promise<RouterOutputs['event']['getByShortId']>;
}

export function ManageEventButton({eventPromise}: Props) {
  const event = use(eventPromise);
  const router = useRouter();
  const params = useParams();
  const shortId = params?.id as string;
  const {modal: removeEventModal, onRemoveClick} = useRemoveEvent({
    eventId: event?.id,
  });
  const {modal: publishModal, onPublishClick} = usePublishEvent({
    eventId: event?.id,
  });
  const {modal: unpublishModal, onUnpublishClick} = useUnpublishEvent({
    eventId: event?.id,
  });

  return (
    <div className="flex gap-2 w-full">
      {removeEventModal}
      {publishModal}
      {unpublishModal}
      <div className="grow">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="w-full"
              size={'lg'}
              data-testid="manage-event-button"
            >
              <ChevronDown className="mr-2 h-4 w-4" />
              Manage event
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Manage</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                data-testid="select-option-button"
                onClick={() => {
                  router.push(`/e/${shortId}/info`);
                }}
              >
                <Info className="mr-2 h-4 w-4" />
                <span>Info</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid="select-option-button"
                onClick={() => {
                  router.push(`/e/${shortId}/edit`);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid="select-option-button"
                onClick={() => {
                  router.push(`/e/${shortId}/attendees`);
                }}
              >
                <Users className="mr-2 h-4 w-4" />
                <span>Attendees</span>
              </DropdownMenuItem>
              {!event?.isPublished && (
                <DropdownMenuItem
                  onClick={onPublishClick}
                  data-testid="select-option-button"
                >
                  <UploadCloud className="mr-2 h-4 w-4 text-green-600" />
                  <span className="text-green-600">Publish</span>
                </DropdownMenuItem>
              )}
              {event?.isPublished && (
                <DropdownMenuItem
                  onClick={onUnpublishClick}
                  data-testid="select-option-button"
                >
                  <DownloadCloud className="mr-2 h-4 w-4 text-destructive" />
                  <span className="text-destructive">Unpublish</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={onRemoveClick}
                data-testid="select-option-button"
              >
                <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                <span className="text-destructive">Remove</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
