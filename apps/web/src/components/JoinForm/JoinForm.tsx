'use client';

import {FormEventHandler} from 'react';
import {useFormContext} from 'react-hook-form';
import type {JoinForm as JoinFormType} from '../../types/forms';
import {Button} from 'ui';
import {Input} from '../Input/Input/Input';
import {Switch} from '../Input/Switch/Switch';

interface Props {
  onSubmit: FormEventHandler;
}

export function JoinForm({onSubmit}: Props) {
  const {
    register,
    formState: {errors, isSubmitting, defaultValues},
    control,
  } = useFormContext<JoinFormType>();

  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-12 gap-2 grow mr-2">
        <div className="col-span-6">
          <Input
            placeholder="First name"
            {...register('firstName', {
              required: 'First name is required',
            })}
            error={errors.firstName}
          />
        </div>
        <div className="col-span-6">
          <Input
            placeholder="Last name"
            {...register('lastName', {
              required: 'Last name is required',
            })}
            error={errors.lastName}
          />
        </div>
        <div className="col-span-8">
          <Input
            type="email"
            placeholder="Email"
            {...register('email', {
              required: 'Email is required',
            })}
            error={errors.email}
          />
        </div>
        <div className="col-span-4">
          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Join
          </Button>
        </div>
        <div className="col-span-12">
          <Switch
            name="hasPlusOne"
            control={control}
            defaultValue={defaultValues?.hasPlusOne || false}
          >
            Bring +1
          </Switch>
        </div>
      </div>
    </form>
  );
}
