import React, { useState, useEffect } from 'react';
import { getCipherInputField } from '../../utils/encryptionUtils';
type EncryptionMethod = 'aes' | 'des' | 'rsa' | 'caesar' | 'playfair' | 'hill' | 'vigenere' | null;

interface EncryptionFormProps {
  encryptionMethod: EncryptionMethod;
  passwordValue: string;
  setPasswordValue: (value: string) => void;
}

const EncryptionForm: React.FC<EncryptionFormProps> = ({
  encryptionMethod,
  passwordValue,
  setPasswordValue
}) => {
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  if (!encryptionMethod) return null;
  
  const inputConfig = getCipherInputField(encryptionMethod);
  
  const validateInput = (value: string) => {
    if (!value) {
      setIsValid(false);
      setErrorMessage(`${inputConfig.label} is required`);
      return false;
    }
    
    if (inputConfig.validation && !inputConfig.validation.test(value)) {
      setIsValid(false);
      setErrorMessage(`Invalid format for ${inputConfig.label.toLowerCase()}`);
      return false;
    }
    
    setIsValid(true);
    setErrorMessage(null);
    return true;
  };
  
  useEffect(() => {
    if (passwordValue) {
      validateInput(passwordValue);
    }
  }, [encryptionMethod]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPasswordValue(newValue);
    validateInput(newValue);
  };
  
  return (
    <div className="mt-4">
      <label 
        htmlFor="encryption-input" 
        className="block text-sm font-medium text-slate-300 mb-2"
      >
        {inputConfig.label}
      </label>
      
      <input
        id="encryption-input"
        type={inputConfig.type}
        className={`w-full bg-slate-700 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
          !isValid ? 'border-red-500' : 'border-slate-600'
        }`}
        placeholder={inputConfig.placeholder}
        value={passwordValue}
        onChange={handleInputChange}
        min={inputConfig.type === 'number' ? 1 : undefined}
        max={inputConfig.type === 'number' ? 25 : undefined}
      />
      
      {errorMessage && (
        <p className="mt-1 text-xs text-red-400">{errorMessage}</p>
      )}
      
      {inputConfig.helpText && !errorMessage && (
        <p className="mt-1 text-xs text-slate-500">{inputConfig.helpText}</p>
      )}
    </div>
  );
};

export default EncryptionForm;