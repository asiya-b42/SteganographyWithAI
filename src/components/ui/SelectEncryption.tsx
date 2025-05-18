import React from 'react';
import { ShieldCheck, KeyRound, Lock, AlignJustify, Grid, Hash, FileText } from 'lucide-react';

type EncryptionMethod = 'aes' | 'des' | 'rsa' | 'caesar' | 'playfair' | 'hill' | 'vigenere' | null;

interface EncryptionOption {
  id: EncryptionMethod;
  name: string;
  description: string;
  icon: JSX.Element;
  inputLabel: string;
  inputType: string;
  inputPlaceholder: string;
  inputHelp?: string;
}

interface SelectEncryptionProps {
  selectedMethod: EncryptionMethod;
  onChange: (method: EncryptionMethod) => void;
}

const SelectEncryption: React.FC<SelectEncryptionProps> = ({ selectedMethod, onChange }) => {
  const encryptionOptions: EncryptionOption[] = [
    {
      id: 'aes',
      name: 'AES-256',
      description: 'Advanced Encryption Standard, high security for sensitive data',
      icon: <ShieldCheck className="h-6 w-6" />,
      inputLabel: 'Password',
      inputType: 'password',
      inputPlaceholder: 'Enter a secure password',
      inputHelp: 'Use a strong password for better security'
    },
    {
      id: 'des',
      name: 'Triple DES',
      description: 'Applies DES algorithm three times to each data block',
      icon: <KeyRound className="h-6 w-6" />,
      inputLabel: 'Password',
      inputType: 'password',
      inputPlaceholder: 'Enter a secure password'
    },
    {
      id: 'rsa',
      name: 'RSA',
      description: 'Asymmetric encryption with public and private keys',
      icon: <Lock className="h-6 w-6" />,
      inputLabel: 'Password',
      inputType: 'password',
      inputPlaceholder: 'Enter a secure password'
    },
    {
      id: 'caesar',
      name: 'Caesar Cipher',
      description: 'Simple substitution cipher with fixed letter shift',
      icon: <AlignJustify className="h-6 w-6" />,
      inputLabel: 'Shift Value',
      inputType: 'number',
      inputPlaceholder: 'Enter a number from 1-25',
      inputHelp: 'This is the number of positions each letter is shifted'
    },
    {
      id: 'playfair',
      name: 'Playfair Cipher',
      description: 'Encrypts pairs of letters using a key table',
      icon: <Grid className="h-6 w-6" />,
      inputLabel: 'Keyword',
      inputType: 'text',
      inputPlaceholder: 'Enter a keyword',
      inputHelp: 'This word is used to generate the cipher key square'
    },
    {
      id: 'hill',
      name: 'Hill Cipher',
      description: 'Uses matrix multiplication for encryption',
      icon: <Hash className="h-6 w-6" />,
      inputLabel: 'Key Matrix',
      inputType: 'text',
      inputPlaceholder: 'Format: a,b;c,d (2x2 matrix)',
      inputHelp: 'Example: 1,2;3,4 for matrix [[1,2],[3,4]]'
    },
    {
      id: 'vigenere',
      name: 'Vigenère Cipher',
      description: 'Polyalphabetic substitution using a keyword',
      icon: <FileText className="h-6 w-6" />,
      inputLabel: 'Keyword',
      inputType: 'text',
      inputPlaceholder: 'Enter a keyword',
      inputHelp: 'A longer keyword provides better security'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {encryptionOptions.map((option) => (
        <div
          key={option.id}
          className={`p-4 rounded-lg cursor-pointer transition-all border ${
            selectedMethod === option.id
              ? 'border-indigo-500 bg-indigo-900/20 shadow-lg shadow-indigo-500/10'
              : 'border-slate-700 bg-slate-800 hover:bg-slate-700'
          }`}
          onClick={() => onChange(option.id)}
        >
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-full ${
              selectedMethod === option.id ? 'text-indigo-400 bg-indigo-900/30' : 'text-slate-400 bg-slate-800'
            }`}>
              {option.icon}
            </div>
            <div>
              <h3 className={`font-medium ${selectedMethod === option.id ? 'text-indigo-400' : 'text-white'}`}>
                {option.name}
              </h3>
              <p className="text-sm text-slate-400 mt-1">{option.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SelectEncryption;