import React, { useState } from 'react';
import Container from '../components/shared/Container';
import Card, { Body as CardBody, Title as CardTitle } from '../components/shared/Card';
import Button from '../components/shared/Button';
import { Form, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { TbUser, TbMail, TbMessage, TbPencil } from 'react-icons/tb';
import { useApiRequest } from '../hooks/useApiRequest';
import { contactService } from '../services';
import { contactSchema, validateFormDataWithFieldErrors, type ContactFormData } from '../utils/validationSchemas';

const initialState: ContactFormData = { name: '', email: '', subject: '', message: '' };

const Contact: React.FC = () => {
  const [form, setForm] = useState<ContactFormData>(initialState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [generalErrors, setGeneralErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const { makeRequest } = useApiRequest();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setGeneralErrors([]);
    setSuccess(null);
    const validation = validateFormDataWithFieldErrors(contactSchema, form);
    if (!validation.success) {
      setFormErrors(validation.fieldErrors);
      setGeneralErrors(validation.generalErrors);
      return;
    }
    setLoading(true);
    try {
      await makeRequest(() => contactService.sendContactMessage(form));
      setSuccess('Your message has been sent!');
      setForm(initialState);
    } catch (err: unknown) {
      setGeneralErrors([err instanceof Error ? err.message : 'Failed to send message.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card className="mx-auto my-5" style={{ maxWidth: 500 }}>
        <CardBody>
          <CardTitle as="h2" className="mb-4 text-center">Contact Us</CardTitle>
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="contactName">
              <Form.Label>Name</Form.Label>
              <InputGroup>
                <InputGroup.Text><TbUser /></InputGroup.Text>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  isInvalid={!!formErrors.name}
                />
                <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3" controlId="contactEmail">
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <InputGroup.Text><TbMail /></InputGroup.Text>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  isInvalid={!!formErrors.email}
                />
                <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3" controlId="contactSubject">
              <Form.Label>Subject</Form.Label>
              <InputGroup>
                <InputGroup.Text><TbPencil /></InputGroup.Text>
                <Form.Control
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  isInvalid={!!formErrors.subject}
                />
                <Form.Control.Feedback type="invalid">{formErrors.subject}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3" controlId="contactMessage">
              <Form.Label>Message</Form.Label>
              <InputGroup>
                <InputGroup.Text><TbMessage /></InputGroup.Text>
                <Form.Control
                  as="textarea"
                  name="message"
                  placeholder="Type your message..."
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  isInvalid={!!formErrors.message}
                />
                <Form.Control.Feedback type="invalid">{formErrors.message}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            {generalErrors.length > 0 && generalErrors.map((err, idx) => (
              <Alert key={idx} variant="danger">{err}</Alert>
            ))}
            {success && <Alert variant="primary">{success}</Alert>}
            <div className="d-grid">
              <Button type="submit" variant="primary" disabled={loading} size="lg">
                {loading ? <><Spinner animation="border" size="sm" className="me-2" /> Sending...</> : 'Send Message'}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Contact; 