import React, { useState } from 'react';
import styled from 'styled-components';
import { Eye, EyeOff } from 'lucide-react'; // Importing icons

interface TextInputProps {
  name: string;
  value: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({ name, value, type, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === 'password';

  return (
    <StyledWrapper>
      <div className="input-group">
        <input
          required
          type={isPassword && showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete="off"
          className="input"
          id={name}
        />
        <label htmlFor={name} className="user-label">{name}</label>
        
        {isPassword && (
          <button 
            type="button" 
            className="toggle-password" 
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </StyledWrapper>
  );
};

export default TextInput;

const StyledWrapper = styled.div`
  .input-group {
    position: relative;
    width: 100%;
  }

  .input {
    border: solid 1.5px #9e9e9e;
    border-radius: 1rem;
    background: none;
    padding: 1rem;
    font-size: 1rem;
    color: #f5f5f5;
    transition: border 150ms cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;
    padding-right: 2.5rem; /* Space for eye icon */
  }

  .user-label {
    position: absolute;
    left: 15px;
    color: #e8e8e8;
    pointer-events: none;
    transform: translateY(1rem);
    transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .input:focus, .input:valid {
    outline: none;
    border: 1.5px solid #1a73e8;
  }

  .input:focus ~ label, .input:valid ~ label {
    transform: translateY(-50%) scale(0.8);
    background-color: #212121;
    padding: 0 .2em;
    color: #2196f3;
  }

  .toggle-password {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #f5f5f5;
    display: flex;
    align-items: center;
  }

  .toggle-password svg {
    width: 20px;
    height: 20px;
  }
`;
