'use client';

import {useTracker} from 'hooks';
import {Button, CardBase} from 'ui';
import {LocationImage} from 'ui';
import {Text} from 'ui';
import {env} from 'client-env';

interface Props {
  address: string;
  latitude: number;
  longitude: number;
  eventId: string;
}

export function LocationCard({address, longitude, latitude, eventId}: Props) {
  const {logEvent} = useTracker();
  const onGetDirectionsClick = () => {
    logEvent('get_directions_button_clicked', {eventId});
    window?.open(`https://www.google.com/maps/search/${address}`);
  };

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
          apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          address={address}
          longitude={longitude}
          latitude={latitude}
        />
      </div>
    </CardBase>
  );
}
