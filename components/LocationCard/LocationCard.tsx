import {Card} from '../DateCard/Card/Card';
import {SectionTitle} from '../Text/SectionTitle';
import {Text} from '../Text/Text';
import * as React from 'react';
import {GoogleLocationImage} from './GoogleLocationImage';
import {Button} from '../Button/Button';

interface Props {
  address: string;
  latitude: number;
  longitude: number;
}

export function LocationCard({address, longitude, latitude}: Props) {
  const onDirectionsClick = () => {
    window?.open(`https://www.google.com/maps/search/${address}`);
  };

  return (
    <Card>
      <div className="mb-2">
        <SectionTitle color="blue" className="mr-2">
          Where
        </SectionTitle>
        <Button onClick={onDirectionsClick} variant="link-neutral">
          Get directions
        </Button>
      </div>
      <Text className="font-bold">{address}</Text>
      <div className="mb-2" />
      <div>
        <GoogleLocationImage
          address={address}
          longitude={longitude}
          latitude={latitude}
          width={550}
          height={250}
        />
      </div>
    </Card>
  );
}
