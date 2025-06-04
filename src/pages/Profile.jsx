import { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import Container from '../components/shared/Container';

const Profile = () => {
  const { api } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userProfile, setUserProfile] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/user/');
        setUserProfile(response.data);
        setError('');
      } catch (error) {
        setError(error.response?.data?.detail || 'Failed to fetch profile');
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [api]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.patch('/auth/user/', userProfile);
      setUserProfile(response.data);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container pageContainer>
        <div className="center-content">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  return (
    <Container pageContainer>
      <Container className="py-4">
        <h2 className="mb-4">Profile Settings</h2>
        
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" className="mb-4">
            {success}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={userProfile.username}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={userProfile.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="first_name"
              value={userProfile.first_name}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="last_name"
              value={userProfile.last_name}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </Form>
      </Container>
    </Container>
  );
};

export default Profile;
