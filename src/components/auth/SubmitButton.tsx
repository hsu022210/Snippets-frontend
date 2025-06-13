import { Spinner } from 'react-bootstrap';
import Button from '../shared/Button';
import { SubmitButtonProps } from '../../types/interfaces';

const SubmitButton = ({ loading, loadingText, children }: SubmitButtonProps) => {
  return (
    <Button
      variant="outline-primary"
      size="lg"
      className="w-100 d-flex align-items-center justify-content-center"
      type="submit"
      disabled={loading}
    >
      {loading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="me-2"
            data-testid="spinner"
          />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton; 