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
        <DateCard />
      </div>
      <div>
        <LocationCard />
      </div>
    </>
  );
}
