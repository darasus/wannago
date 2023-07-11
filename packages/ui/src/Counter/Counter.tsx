'use client';

import {Minus, Plus} from 'lucide-react';
import {Button} from '../Button/Button';

interface Props {
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
}

export function Counter({value, onChange, maxValue, minValue}: Props) {
  return (
    <div className="flex items-center gap-4">
      <Button
        size="icon"
        variant={'outline'}
        onClick={(e) => {
          e.preventDefault();

          if (typeof minValue === 'number' && value === minValue) {
            return;
          }

          onChange(value - 1);
        }}
      >
        <Minus className="w-4 h-4" />
      </Button>
      <span style={{fontVariantNumeric: 'tabular-nums'}}>{value}</span>
      <Button
        size="icon"
        variant={'outline'}
        onClick={(e) => {
          if (maxValue && value === maxValue) {
            return;
          }

          onChange(value + 1);

          e.preventDefault();
        }}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
