'use client';

import {useCallback, useState} from 'react';

export function useGenerateEventDescription() {
  const [isLoading, setLoading] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string>('');

  const generate = useCallback(async (eventTitle: string) => {
    setGeneratedOutput('');
    setLoading(true);
    const response = await fetch('/api/ai/generate-event-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: eventTitle,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const {value, done: doneReading} = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedOutput(prev => prev + chunkValue);
    }
    setLoading(false);
  }, []);

  return {generate, isLoading, generatedOutput};
}
