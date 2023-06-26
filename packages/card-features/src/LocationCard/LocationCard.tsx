'use client';

import {LocationCard as LocationCardView} from 'cards';
import {useAmplitudeAppDir} from 'hooks';

interface Props {
  address: string | null;
  latitude: number;
  longitude: number;
  eventId: string;
}

export function LocationCard({address, longitude, latitude, eventId}: Props) {
  const {logEvent} = useAmplitudeAppDir();
  const onGetDirectionsClick = () => {
    logEvent('get_directions_button_clicked', {eventId});
    window?.open(`https://www.google.com/maps/search/${address}`);
  };

  return (
    <LocationCardView
      address={address}
      longitude={longitude}
      latitude={latitude}
      onGetDirectionsClick={onGetDirectionsClick}
    />
  );
}
