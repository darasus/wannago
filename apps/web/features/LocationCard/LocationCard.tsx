import {LocationCard as LocationCardView} from '../../components/LocationCard/LocationCard';
import {useAmplitude} from 'hooks';

interface Props {
  address: string;
  latitude: number;
  longitude: number;
  eventId: string;
}

export function LocationCard({address, longitude, latitude, eventId}: Props) {
  const {logEvent} = useAmplitude();
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
