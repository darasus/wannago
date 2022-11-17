'use client';

import {Card} from '../Card/Card';
import {SectionTitle} from '../Text/SectionTitle';
import {Text} from '../Text/Text';
import * as React from 'react';
import {GoogleLocationImage} from './GoogleLocationImage';
import {Button} from '../Button/Button';

export function LocationCard() {
  const address = 'Nieuwendammerdijk 29, 1025LC, Amsterdam';

  return (
    <Card>
      <div className="mb-2">
        <SectionTitle color="blue" className="mr-2">
          Where
        </SectionTitle>
        <Button variant="link-neutral">Get directions</Button>
      </div>
      <Text className="font-bold">{address}</Text>
      <div className="mb-2" />
      <div>
        <GoogleLocationImage address={address} width={550} height={250} />
      </div>
    </Card>
  );
}
