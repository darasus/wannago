import {Button} from '../components/Button/Button';

const sizes = ['sm', 'md', 'lg'] as const;

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-y-4 p-4">
      {sizes.map(size => {
        return (
          <div key={size} className="flex items-center gap-x-4">
            <Button size={size}>Default</Button>
            <Button size={size} variant="primary">
              Primary
            </Button>
            <Button size={size} variant="secondary">
              Secondary
            </Button>
            <Button size={size} variant="neutral">
              Neutral
            </Button>
            <Button size={size} variant="link-neutral">
              Link neutral
            </Button>
            <Button size={size} variant="link">
              Link
            </Button>
            <Button size={size} variant="danger">
              Danger
            </Button>
          </div>
        );
      })}
    </div>
  );
}
