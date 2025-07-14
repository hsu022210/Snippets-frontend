import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { TbCopy, TbCheck } from 'react-icons/tb';
import { useToast } from '../../contexts/ToastContext';
import { CopyButtonProps } from '../../types';

const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  size = 'sm',
  variant = 'outline-secondary',
  className = '',
  disabled = false,
}) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = async () => {
    if (!textToCopy || disabled) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      showToast('Code copied to clipboard!', 'primary', 2);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
      showToast('Failed to copy code to clipboard', 'danger');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      disabled={disabled || !textToCopy}
      className={`d-flex align-items-center gap-1 ${className}`}
      title="Copy code to clipboard"
    >
      {copied ? (
        <>
          <TbCheck size={16} />
          Copied!
        </>
      ) : (
        <>
          <TbCopy size={16} />
          Copy
        </>
      )}
    </Button>
  );
};

export default CopyButton; 