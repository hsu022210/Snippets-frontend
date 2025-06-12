import { ReactNode } from 'react';
import { Button, Spinner } from 'react-bootstrap';

interface SubmitButtonProps {
  loading: boolean;
  loadingText: string;
  children: ReactNode;
}

const SubmitButton = ({ loading, loadingText, children }: SubmitButtonProps) => {
  return (
    <Button
      variant="primary"
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