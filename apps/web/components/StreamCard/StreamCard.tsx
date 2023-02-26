import Image from 'next/image';
import {
  getStreamProviderFromUrl,
  StreamHost,
} from '../../utils/getStreamProviderFromUrl';
import {Badge} from 'ui';
import {Button} from 'ui';
import {CardBase} from '../CardBase/CardBase';
import {Googlemeet} from '@styled-icons/simple-icons/Googlemeet';
import {Youtube} from '@styled-icons/simple-icons/Youtube';
import {Twitch} from '@styled-icons/simple-icons/Twitch';
import {VideoCameraIcon} from '@heroicons/react/24/outline';
import useCopyClipboard from '../../hooks/useCopyClipboard';
import {useAmplitude} from '../../hooks/useAmplitude';

interface Props {
  streamUrl: string;
  eventId: string;
}

const iconMap: Record<StreamHost, JSX.Element> = {
  meet: <Googlemeet className="__simple-icons-svg" />,
  youtube: <Youtube className="__simple-icons-svg" />,
  twitch: <Twitch className="__simple-icons-svg" />,
};

export function StreamCard({streamUrl, eventId}: Props) {
  const [isCopied, copy] = useCopyClipboard(streamUrl);
  const {logEvent} = useAmplitude();
  const host = getStreamProviderFromUrl(streamUrl);
  const icon = iconMap[host] || <VideoCameraIcon />;

  const onCopyUrlClick = () => {
    logEvent('copy_stream_url_button_clicked', {eventId});
    copy();
  };

  return (
    <CardBase>
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
          {isCopied ? 'Copied!' : 'Copy url'}
        </Button>
      </div>
      <div className="flex">
        <Button
          variant="neutral"
          iconLeft={icon}
          as="a"
          href={streamUrl}
          target="_blank"
        >
          Join stream
        </Button>
      </div>
    </CardBase>
  );
}
