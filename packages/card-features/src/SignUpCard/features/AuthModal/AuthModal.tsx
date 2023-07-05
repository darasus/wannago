'use client';

import {useState} from 'react';
import {Modal} from 'ui';
import {Login, Register} from 'auth-features';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDone?: () => void;
}

export function AuthModal({isOpen, onClose, onDone}: Props) {
  const [step, setStep] = useState<'login' | 'register'>('login');

  return (
    <Modal title="" isOpen={isOpen} onClose={onClose}>
      {step === 'login' && (
        <Login
          onCreateAccountClick={() => setStep('register')}
          onDone={() => {
            onClose();
            onDone?.();
          }}
        />
      )}
      {step === 'register' && (
        <Register
          onLoginClick={() => setStep('login')}
          onDone={() => {
            onClose();
            onDone?.();
          }}
        />
      )}
    </Modal>
  );
}
