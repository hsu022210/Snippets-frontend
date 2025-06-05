import { Form } from 'react-bootstrap';

const FormField = ({
  label,
  type = 'text',
  name,
  id,
  value,
  onChange,
  disabled = false,
  required = false,
  autoComplete,
  className = 'mb-3',
  error,
  isInvalid
}) => {
  return (
    <Form.Group className={className}>
      <Form.Label htmlFor={id}>{label}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        size="lg"
        className="form-control-light"
        autoComplete={autoComplete}
        isInvalid={isInvalid}
      />
      {error && (
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default FormField; 