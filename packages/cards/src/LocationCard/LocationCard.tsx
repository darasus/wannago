import {Badge, Button, CardBase} from 'ui';
import {LocationImage} from 'ui/src/components/LocationImage/LocationImage';
import {Text} from 'ui';

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
      <div className="flex">
        <Text title={address} className="font-bold truncate">
          {address}
        </Text>
      </div>
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
