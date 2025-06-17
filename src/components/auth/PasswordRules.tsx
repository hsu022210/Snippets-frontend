import { Form } from 'react-bootstrap'
import { PasswordRule, PasswordRulesProps } from '../../types/interfaces'
import { BsCheckCircleFill, BsCircle } from 'react-icons/bs'

const PasswordRules = ({ password }: PasswordRulesProps) => {
  const rules: PasswordRule[] = [
    {
      label: 'At least 8 characters',
      isValid: password.length >= 8
    },
    {
      label: 'At least one letter',
      isValid: /[A-Za-z]/.test(password)
    },
  ];

  return (
    <div className="mt-2">
      <Form.Text className="text-muted">
        Password must meet the following requirements:
      </Form.Text>
      <ul className="list-unstyled mt-2">
        {rules.map((rule, index) => (
          <li key={index} className="d-flex align-items-center mb-1">
            <span className={`me-2 ${rule.isValid ? 'text-success' : 'text-muted'}`}>
              {rule.isValid ? (
                <BsCheckCircleFill size={16} data-testid="valid-icon" />
              ) : (
                <BsCircle size={16} data-testid="invalid-icon" />
              )}
            </span>
            <small className={rule.isValid ? 'text-success' : 'text-muted'}>
              {rule.label}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordRules; 