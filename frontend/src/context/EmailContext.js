import { createContext, useContext, useState, useEffect } from 'react';

const EmailContext = createContext();

export const useEmailContext = () => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error('useEmailContext must be used within an EmailProvider');
  }
  return context;
};

export const EmailProvider = ({ children }) => {
  console.log('🚀 EmailProvider is mounting!');
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch emails from backend
  const fetchEmails = async () => {
    console.log('📧 fetchEmails function called!');
    setLoading(true);
    setError(null);
    try {
      console.log('🌐 Starting fetch to /api/backend/emails');
      const response = await fetch('/api/backend/emails');
      
      console.log('✅ Fetch completed, response:', response);
      console.log('📊 Response status:', response.status);
      console.log('📊 Response ok:', response.ok);

      if (!response.ok) {
        throw new Error('Failed to fetch emails');
      }
      const data = await response.json();
      setEmails(data.emails || data);
    } catch (err) {
      console.error('❌ Error in fetchEmails:', err);
      console.error('❌ Error name:', err.name);
      console.error('❌ Error message:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Send email
  const sendEmail = async (emailData) => {
    console.log('📤 Sending email with data:', emailData);
    try {
      console.log('🌐 POST request to /api/backend/emails');
      const response = await fetch('/api/backend/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });
      
      console.log('✅ Email send response:', response);
      console.log('📊 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      
      console.log('🎉 Email sent successfully!');
      // Refresh emails after sending
      await fetchEmails();
      return { success: true };
    } catch (err) {
      console.error('❌ Error sending email:', err);
      return { success: false, error: err.message };
    }
  };

  // Get single email
  const getEmail = async (id) => {
    try {
      const response = await fetch(`/api/backend/emails/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch email');
      }
      return await response.json();
    } catch (err) {
      console.error('Error fetching email:', err);
      throw err;
    }
  };

  useEffect(() => {
    console.log('⚡ useEffect is running!');
    fetchEmails();
  }, []);

  const value = {
    emails,
    loading,
    error,
    fetchEmails,
    sendEmail,
    getEmail,
  };

  return (
    <EmailContext.Provider value={value}>
      {children}
    </EmailContext.Provider>
  );
}; 