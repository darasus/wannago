import {InfoIcon} from 'lucide-react';
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
      <InfoIcon
        className={cn('h-[15px] w-[15px] block cursor-pointer', className)}
        onClick={openModal}
      />
    </div>
  );
}
