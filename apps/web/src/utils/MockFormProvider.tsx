import {PropsWithChildren} from 'react';
import {FormProvider, useForm} from 'react-hook-form';

interface Props extends PropsWithChildren {}

export function MockFormProvider({children}: Props) {
  const form = useForm();

  return <FormProvider {...form}>{children}</FormProvider>;
}
