import { useState, ChangeEvent } from 'react';
import { Form } from 'react-bootstrap';
import { useToast } from '../../contexts/ToastContext';

interface FileUploadProps {
  onFileRead: (content: string) => void;
  acceptedTypes?: string;
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileRead, 
  acceptedTypes = '.txt,.js,.ts,.jsx,.tsx,.html,.css,.scss,.json,.py,.java,.c,.cpp,.cs,.php,.rb,.go,.rs,.swift,.kt',
  label = 'Upload Code File (optional)'
}) => {
  const { showToast } = useToast();
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    try {
      const content = await readFileAsText(file);
      onFileRead(content);
    } catch (error) {
      console.error('Error reading file:', error);
      showToast('Error reading file', 'danger');
      setFileName('');
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label className='fw-bold'>{label}</Form.Label>
      <Form.Control 
        type="file" 
        onChange={handleFileChange}
        accept={acceptedTypes}
      />
      {fileName && (
        <div className="small text-muted mt-1">
          Selected file: {fileName}
        </div>
      )}
    </Form.Group>
  );
};

export default FileUpload;
