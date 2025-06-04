import { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const PasswordInput = ({ 
  value, 
  onChange, 
  label, 
  required = false, 
  disabled = false, 
  size = 'md',
  className = '',
  autoComplete = 'current-password',
  placeholder = '',
  isInvalid = false,
  error = ''
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}
      <InputGroup>
        <Form.Control
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          size={size}
          className={`form-control-light ${className}`}
          autoComplete={autoComplete}
          placeholder={placeholder}
          isInvalid={isInvalid}
        />
        <Button
          variant="outline-secondary"
          onClick={togglePasswordVisibility}
          disabled={disabled}
          className="d-flex align-items-center"
        >
          {showPassword ? (
            <i className="bi bi-eye-slash"></i>
          ) : (
            <i className="bi bi-eye"></i>
          )}
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

PasswordInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  autoComplete: PropTypes.string,
  placeholder: PropTypes.string,
  isInvalid: PropTypes.bool,
  error: PropTypes.string
};

export default PasswordInput; 