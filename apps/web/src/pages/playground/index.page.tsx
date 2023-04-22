import {ArrowDownCircleIcon} from '@heroicons/react/24/solid';
import {Accordion, Badge, Button, Container, LoadingWave} from 'ui';
import {Input} from '../../components/Input/Input/Input';

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
    <Container maxSize="full" className="flex flex-col gap-4">
      <Section>
        {sizes.map(size => {
          return (
            <div key={size} className="flex items-center gap-4">
              <Button size={size}>Default</Button>
              <Button size={size} variant="primary">
                Primary
              </Button>
              <Button
                size={size}
                variant="primary"
                iconLeft={<ArrowDownCircleIcon />}
              >
                Primary with icon
              </Button>
              <Button size={size} variant="secondary">
                Secondary
              </Button>
              <Button
                size={size}
                variant="secondary"
                iconLeft={<ArrowDownCircleIcon />}
              >
                Secondary with icon
              </Button>
              <Button size={size} variant="neutral">
                Neutral
              </Button>
              <Button
                size={size}
                variant="neutral"
                iconLeft={<ArrowDownCircleIcon />}
              >
                Neutral with icon
              </Button>
              <Button size={size} variant="link">
                Link
              </Button>
              <Button
                size={size}
                variant="link"
                iconLeft={<ArrowDownCircleIcon />}
              >
                Link with icon
              </Button>
              <Button size={size} variant="link-gray">
                Link gray
              </Button>
              <Button
                size={size}
                variant="link-gray"
                iconLeft={<ArrowDownCircleIcon />}
              >
                Link gray with icon
              </Button>
              <Button size={size} variant="success">
                Success
              </Button>
              <Button
                size={size}
                variant="success"
                iconLeft={<ArrowDownCircleIcon />}
              >
                Success with icon
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
              <Button size={size} iconLeft={<ArrowDownCircleIcon />} />
            </div>
          );
        })}
      </Section>
      <Section>
        <Input label="Hello" placeholder="Placeholder..." isLoading />
      </Section>
      <Section>
        <Accordion items={items} />
      </Section>
      <Section>
        {(['xs', 'sm', 'md', 'lg'] as const).map(size => {
          return (
            <div className="flex gap-4">
              {(
                [
                  'gray',
                  'yellow',
                  'green',
                  'indigo',
                  'purple',
                  'pink',
                  'red',
                ] as const
              ).map(color => {
                return (
                  <Badge size={size} color={color}>
                    Hello
                  </Badge>
                );
              })}
            </div>
          );
        })}
      </Section>
      <Section>
        <LoadingWave />
      </Section>
    </Container>
  );
}

function Section({children}: {children: React.ReactNode}) {
  return <div className="flex flex-col gap-4">{children}</div>;
}
