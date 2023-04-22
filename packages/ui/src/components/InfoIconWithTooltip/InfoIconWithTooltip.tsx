import {InformationCircleIcon} from '@heroicons/react/24/solid';
import {useState} from 'react';
import {cn} from 'utils';
import {Modal} from '../Modal/Modal';

interface Props {
  className?: string;
  text: string;
}

export function InfoIconWithTooltip({className, text}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);

  return (
    <div className="group relative">
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {text}
      </Modal>
      <InformationCircleIcon
        className={cn('h-[15px] w-[15px] block', className)}
        onClick={openModal}
      />
    </div>
  );
}
