import { useState} from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import Button from '../shared/Button'
import { PasswordInputProps } from '../../types'

const PasswordInput = ({ 
  value, 
  onChange, 
  label,
  name,
  id, 
  required = false, 
  disabled = false, 
  size,
  className = '',
  autoComplete = 'current-password',
  placeholder = '',
  isInvalid = false,
  error = ''
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form.Group className="mb-3">
      {label && <Form.Label htmlFor={id}>{label}</Form.Label>}
      <InputGroup hasValidation size={size}>
        <Form.Control
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          name={name}
          id={id}
          required={required}
          disabled={disabled}
          className={`form-control-light ${className}`}
          autoComplete={autoComplete}
          placeholder={placeholder}
          isInvalid={isInvalid}
        />
        <Button
          variant="outline-secondary"
          onClick={togglePasswordVisibility}
          disabled={disabled}
          className="password-toggle-btn"
          type="button"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
        </Button>
        {error && (
          <Form.Control.Feedback type="invalid">
            {error}
          </Form.Control.Feedback>
        )}
      </InputGroup>
    </Form.Group>
  );
};

export default PasswordInput; 