import { Button, CardBase } from "ui";
import { LocationImage } from "ui/src/components/LocationImage/LocationImage";
import { Text } from "ui";

interface Props {
  address: string | null;
  latitude: number;
  longitude: number;
  onGetDirectionsClick?: () => void;
}

export function LocationCard({
  address,
  latitude,
  longitude,
  onGetDirectionsClick,
}: Props) {
  if (!address) return null;
  return (
    <CardBase
      className="h-full"
      title="Where"
      titleChildren={
        <Button
          onClick={onGetDirectionsClick}
          variant="link"
          size="sm"
          className="p-0 h-auto"
        >
          Get directions
        </Button>
      }
    >
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
        />
      </div>
    </CardBase>
  );
}
