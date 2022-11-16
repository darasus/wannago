import {add} from 'date-fns';
import {DateCard} from '../../../components/DateCard/DateCard';
import {InfoCard} from '../../../components/InfoCard/InfoCard';
import {LocationCard} from '../../../components/LocationCard/LocationCard';

export default function EventPage() {
  return (
    <>
      <div className="mb-4">
        <InfoCard />
      </div>
      <div className="mb-4">
        <DateCard date={add(new Date('2023/01/01'), {days: 100})} />
      </div>
      <div>
        <LocationCard />
      </div>
    </>
  );
}
