import {getStreamProviderFromUrl, StreamHost} from 'utils';
import {Button, CardBase, Badge, Text} from 'ui';
import {Googlemeet} from '@styled-icons/simple-icons/Googlemeet';
import {Youtube} from '@styled-icons/simple-icons/Youtube';
import {Twitch} from '@styled-icons/simple-icons/Twitch';
import {VideoCameraIcon} from '@heroicons/react/24/outline';
import {useCopyClipboard, useAmplitude} from 'hooks';

interface Props {
  streamUrl: string;
  eventId: string;
}

const iconMap: Record<StreamHost, JSX.Element> = {
  meet: <Googlemeet className="__simple-icons-svg w-8 h-8" />,
  youtube: <Youtube className="__simple-icons-svg w-8 h-8" />,
  twitch: <Twitch className="__simple-icons-svg w-8 h-8" />,
};

export function StreamCard({streamUrl, eventId}: Props) {
  const [isCopied, copy] = useCopyClipboard(streamUrl);
  const {logEvent} = useAmplitude();
  const host = getStreamProviderFromUrl(streamUrl);
  const icon = (host && iconMap[host]) || (
    <VideoCameraIcon className="w-8 h-8" />
  );

  const onCopyUrlClick = () => {
    logEvent('copy_stream_url_button_clicked', {eventId});
    copy();
  };

  return (
    <CardBase className="h-full" innerClassName="flex flex-col h-full">
      <div className="mb-2">
        <Badge color="gray" className="mr-2" size="xs">
          Where
        </Badge>
        <Button
          onClick={onCopyUrlClick}
          variant="link-gray"
          disabled={isCopied}
          size="xs"
        >
          {isCopied ? 'Copied!' : 'Copy stream url'}
        </Button>
      </div>
      <div className="flex mb-2">
        <Text title={streamUrl} className="font-bold truncate">
          {streamUrl
            .replace('https://www.', '')
            .replace('http://', '')
            .replace('https://', '')}
        </Text>
      </div>
      <div className="flex gap-2 items-center grow">
        <div className="flex justify-center items-center rounded-full bg-slate-200 aspect-square h-full border-2 border-gray-800 min-h-[70px]">
          {icon}
        </div>
        <Button
          variant="link"
          as="a"
          href={streamUrl}
          target="_blank"
          size="sm"
        >
          Join stream
        </Button>
      </div>
    </CardBase>
  );
}
