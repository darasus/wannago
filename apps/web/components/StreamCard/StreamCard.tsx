import Image from 'next/image';
import {
  getStreamProviderFromUrl,
  StreamHost,
} from '../../utils/getStreamProviderFromUrl';
import {Badge} from '../Badge/Badge';
import {Button} from '../Button/Button';
import {CardBase} from '../CardBase/CardBase';
import {LocationImage} from '../LocationImage/LocationImage';
import {Text} from '../Text/Text';

interface Props {
  streamUrl: string;
  onStreamUrlClick?: () => void;
}

const icon: Record<StreamHost, string> = {
  google: 'https://unpkg.com/simple-icons@v8/icons/google.svg',
  youtube: 'https://unpkg.com/simple-icons@v8/icons/youtube.svg',
  twitch: 'https://unpkg.com/simple-icons@v8/icons/twitch.svg',
};

export function StreamCard({streamUrl, onStreamUrlClick}: Props) {
  const host = getStreamProviderFromUrl(streamUrl);

  return (
    <CardBase>
      <div className="mb-2">
        <Badge color="gray" className="mr-2" size="xs">
          Where
        </Badge>
        <Button onClick={onStreamUrlClick} variant="link-gray" size="xs">
          Join streaming
        </Button>
      </div>
      <Text className="font-bold">{streamUrl}</Text>
      <div className="mb-2" />
      <div>
        <div>
          <Image src={icon[host]} alt={icon[host]} width={50} height={50} />
        </div>
      </div>
    </CardBase>
  );
}
