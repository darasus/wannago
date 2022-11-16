'use client';

import debounce from 'lodash.debounce';
import {ChangeEvent, useCallback} from 'react';
import {useQueryState} from './useQueryState';

interface Form {
  title: string;
  description: string;
}

export function useForm() {
  const {state, setState} = useQueryState<Form>();

  const onTitleChange = useCallback(
    debounce((e: ChangeEvent<HTMLInputElement>) => {
      setState({...state, title: e.target.value});
    }, 300),
    [state]
  );

  const onDescriptionChange = useCallback(
    debounce((e: ChangeEvent<HTMLTextAreaElement>) => {
      setState({...state, description: e.target.value});
    }, 300),
    [state]
  );

  return {state, onTitleChange, onDescriptionChange};
}
