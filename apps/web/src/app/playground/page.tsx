"use client";

import {
  Accordion,
  Badge,
  Button,
  Container,
  LoadingWave,
  Select,
  SelectItem,
} from "ui";
import { Input } from "../../components/Input/Input/Input";
import { ChevronDown } from "lucide-react";

const sizes = ["sm", "lg"] as const;

const items = [
  {
    label: "What is Tailwind CSS?",
    content: `Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces. It's completely customizable, completely extensible, and a lot of fun to use!`,
  },
  {
    label: "What is Tailwind CSS?",
    content: `Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces. It's completely customizable, completely extensible, and a lot of fun to use!`,
  },
  {
    label: "What is Tailwind CSS?",
    content: `Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces. It's completely customizable, completely extensible, and a lot of fun to use!`,
  },
  {
    label: "What is Tailwind CSS?",
    content: `Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces. It's completely customizable, completely extensible, and a lot of fun to use!`,
  },
];

export default function PlaygroundPage() {
  return (
    <Container maxSize="full" className="flex flex-col gap-4">
      <Section>
        {sizes.map((size) => {
          return (
            <div key={size} className="flex items-center gap-4">
              <Button size={size}>Default</Button>
              <Button size={size} variant="default">
                Primary
              </Button>
              <Button size={size} variant="default">
                <ChevronDown />
                Primary with icon
              </Button>
              <Button size={size} variant="secondary">
                Secondary
              </Button>
              <Button size={size} variant="outline">
                <ChevronDown /> Secondary with icon
              </Button>
              <Button size={size} variant="outline">
                Neutral
              </Button>
              <Button size={size} variant="outline">
                <ChevronDown />
                Neutral with icon
              </Button>
              <Button size={size} variant="link">
                Link
              </Button>
              <Button size={size} variant="link">
                <ChevronDown />
                Link with icon
              </Button>
              <Button size={size} variant="link">
                Link gray
              </Button>
              <Button size={size} variant="link">
                <ChevronDown />
                Link gray with icon
              </Button>
              <Button size={size} variant="destructive">
                Danger
              </Button>
              <Button size={size} variant="destructive">
                <ChevronDown />
                Danger with icon
              </Button>
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
        {(["xs", "sm", "md", "lg"] as const).map((size) => {
          return (
            <div className="flex gap-4">
              {(
                ["default", "secondary", "destructive", "outline"] as const
              ).map((variant) => {
                return <Badge variant={variant}>Hello</Badge>;
              })}
            </div>
          );
        })}
      </Section>
      <Section>
        <LoadingWave />
      </Section>
      <Section>
        <Select label="Favorite Animal">
          <SelectItem key="red panda">Red Panda</SelectItem>
          <SelectItem key="cat">Cat</SelectItem>
          <SelectItem key="dog">Dog</SelectItem>
          <SelectItem key="aardvark">Aardvark</SelectItem>
          <SelectItem key="kangaroo">Kangaroo</SelectItem>
          <SelectItem key="snake">Snake</SelectItem>
        </Select>
      </Section>
    </Container>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>;
}
