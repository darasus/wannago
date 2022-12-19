import {Button} from '../components/Button/Button';

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div className="flex items-center gap-x-4">
        <Button>Default</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="neutral">Neutral</Button>
        <Button variant="link-neutral">Link neutral</Button>
        <Button variant="link">Link</Button>
        <Button variant="danger">Danger</Button>
      </div>
    </div>
  );
}
