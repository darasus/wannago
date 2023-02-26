import {Badge, Button, CardBase} from 'ui';
import {LocationImage} from '../LocationImage/LocationImage';
import {Text} from '../Text/Text';

interface Props {
  address: string;
  latitude: number;
  longitude: number;
  onGetDirectionsClick: () => void;
}

export function LocationCard({
  address,
  latitude,
  longitude,
  onGetDirectionsClick,
}: Props) {
  return (
    <CardBase>
      <div className="mb-2">
        <Badge color="gray" className="mr-2" size="xs">
          Where
        </Badge>
        <Button onClick={onGetDirectionsClick} variant="link-gray" size="xs">
          Get directions
        </Button>
      </div>
      <Text className="font-bold">{address}</Text>
      <div className="mb-2" />
      <div>
        <LocationImage
          address={address}
          longitude={longitude}
          latitude={latitude}
          width={1200}
          height={200}
        />
      </div>
    </CardBase>
  );
}
