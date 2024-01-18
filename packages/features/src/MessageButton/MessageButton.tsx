'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'ui';
import {getConfig} from 'utils';
import {ContactForm} from '../ContactForm/ContactForm';

export function MessageButton() {
  const {name} = getConfig();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" data-testid="message-button">
          Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact {name}</DialogTitle>
        </DialogHeader>
        <ContactForm />
      </DialogContent>
    </Dialog>
  );
}
