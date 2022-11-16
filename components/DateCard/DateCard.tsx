import {Card} from '../Card/Card';
import {SectionTitle} from '../Text/SectionTitle';
import {Text} from '../Text/Text';

export function DateCard() {
  return (
    <Card>
      <SectionTitle color="yellow">When</SectionTitle>
      <div className="mb-2" />
      <Text>2022/01/01</Text>
    </Card>
  );
}
