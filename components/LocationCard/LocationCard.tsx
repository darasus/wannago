'use client';

import {Card} from '../Card/Card';
import {SectionTitle} from '../Text/SectionTitle';
import {Text} from '../Text/Text';
import * as React from 'react';
import {GoogleLocationImage} from './GoogleLocationImage';

export function LocationCard() {
  const address = 'Nieuwendammerdijk 29, 1025LC, Amsterdam';

  return (
    <Card>
      <SectionTitle color="blue">Where</SectionTitle>
      <div className="mb-2" />
      <Text className="font-bold">{address}</Text>
      <div className="mb-2" />
      <div>
        <GoogleLocationImage address={address} width={500} height={250} />
      </div>
    </Card>
  );
}
