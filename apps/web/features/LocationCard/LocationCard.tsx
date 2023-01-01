import {LocationCard as LocationCardView} from '../../components/LocationCard/LocationCard';

interface Props {
  address: string;
  latitude: number;
  longitude: number;
}

export function LocationCard({address, longitude, latitude}: Props) {
  const onGetDirectionsClick = () => {
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
