import {ArrowDownCircleIcon} from '@heroicons/react/24/solid';
import {Accordion, Button} from 'ui';
import {Input} from '../components/Input/Input/Input';
import {Text} from 'ui';
import {TextAnimation} from '../components/TextAnimation/TextAnimation';

const sizes = ['xs', 'sm', 'md', 'lg'] as const;

const items = [
  {
    label: 'What is Tailwind CSS?',
    content: `Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces. It's completely customizable, completely extensible, and a lot of fun to use!`,
  },
  {
    label: 'What is Tailwind CSS?',
    content: `Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces. It's completely customizable, completely extensible, and a lot of fun to use!`,
  },
  {
    label: 'What is Tailwind CSS?',
    content: `Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces. It's completely customizable, completely extensible, and a lot of fun to use!`,
  },
  {
    label: 'What is Tailwind CSS?',
    content: `Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces. It's completely customizable, completely extensible, and a lot of fun to use!`,
  },
];

export default function PlaygroundPage() {
  return (
    <>
      <div className="flex flex-col gap-y-4 my-4">
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
              <Button size={size} variant="link">
                Link
              </Button>
              <Button size={size} variant="link-gray">
                Link gray
              </Button>
              <Button size={size} variant="success">
                Success
              </Button>
              <Button size={size} variant="danger">
                Danger
              </Button>
              <Button
                size={size}
                variant="danger"
                iconLeft={<ArrowDownCircleIcon />}
              >
                Danger with icon
              </Button>
              <Button size={size} variant="danger" isLoading>
                Danger with spinner
              </Button>
              <Button size={size} isLoading>
                Loading
              </Button>
              <Button size={size} iconLeft={<ArrowDownCircleIcon />}>
                With icon
              </Button>
              <Button size={size} iconLeft={<ArrowDownCircleIcon />} />
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-y-4 my-4">
        <div className="flex items-center gap-x-4">
          <Input label="Hello" placeholder="Placeholder..." isLoading />
          {/* <Switch>+1</Switch> */}
        </div>
      </div>
      <div className="flex flex-col p-4">
        <Accordion items={items} />
      </div>
      <div className="flex flex-col p-4">
        <Text className="text-xl">
          <TextAnimation texts={['private event', 'birthday', 'wedding']} />
        </Text>
      </div>
    </>
  );
}
