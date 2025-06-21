import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { Form, Alert, Card } from 'react-bootstrap'
import { useApiRequest } from '../hooks/useApiRequest'
import Container from '../components/shared/Container'
import InlineLoadingSpinner from '../components/InlineLoadingSpinner'
import { TbKey } from 'react-icons/tb'
import { UserProfile } from '../types'
import Button from '../components/shared/Button'
import { authService, ApiError } from '../services'

const Profile: React.FC = () => {
  const { makeRequest } = useApiRequest();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: '',
    email: '',
    first_name: '',
    last_name: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await makeRequest(
          () => authService.getCurrentUser()
        );
        setUserProfile(userData);
        setError('');
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message || 'Failed to fetch profile');
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [makeRequest]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updatedProfile = await makeRequest(
        () => authService.updateProfile(userProfile)
      );
      setUserProfile(updatedProfile);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || 'Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setError('');
      setSuccess('');
      
      await makeRequest(
        () => authService.requestPasswordReset(userProfile.email),
        'Sending password reset instructions...'
      );

      setSuccess('Password reset instructions have been sent to your email.');
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || 'An error occurred. Please try again.');
      console.error('Password reset error:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="center-content">
          <InlineLoadingSpinner message="Loading profile..." />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="mb-4">Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <div className="row g-4">
        {/* Profile Information Section */}
        <div className="col-12 col-lg-8">
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="mb-4">Profile Information</Card.Title>
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

                <Button type="submit" variant="outline-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>

        {/* Security Section */}
        <div className="col-12 col-lg-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="mb-4">Security</Card.Title>
              <p className="text-muted mb-4">
                Manage your account security settings and password.
              </p>
              <Button 
                variant="outline-danger" 
                onClick={handleResetPassword}
                className="w-100"
              >
                <TbKey className="me-2" size={18} />
                Reset Password
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Profile; 