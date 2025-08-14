import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  AutoAwesome as AIIcon,
  Person as PersonIcon,
  Subject as SubjectIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useEmailContext } from '../context/EmailContext';
import AIPromptModal from './AIPromptModal';
import AIAssistantPicker from './AIAssistantPicker';

const ComposeEmail = ({ open, onClose }) => {
  const { sendEmail } = useEmailContext();
  const [formData, setFormData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [aiPickerOpen, setAiPickerOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState(null);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await sendEmail(formData);
      if (result.success) {
        setSuccess('Email sent successfully!');
        setTimeout(() => {
          onClose();
          setFormData({ to: '', cc: '', bcc: '', subject: '', body: '' });
          setSuccess('');
        }, 1500);
      } else {
        setError(result.error || 'Failed to send email');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAssistantSelect = (assistant) => {
    setSelectedAssistant(assistant);
    setAiModalOpen(true);
  };

  const handleAIGenerate = async (prompt) => {
    setAiModalOpen(false);
    setAiGenerating(true);
    setError('');

    try {
      if (selectedAssistant) {
        // Call the appropriate AI endpoint based on selected assistant
        const endpoint = selectedAssistant.id === 'sales' 
          ? '/api/backend/emails/ai/sales' 
          : '/api/backend/emails/ai/followup';
        
        let requestBody = { prompt: prompt.trim() };
        
        if (selectedAssistant.id === 'sales') {
          // For sales, we need recipientBusiness and recipientName
          // You can add these fields to the AIPromptModal or use placeholders
          requestBody.recipientBusiness = 'Business Company'; // TODO: Add input field
          requestBody.recipientName = 'Recipient'; // TODO: Add input field
        } else if (selectedAssistant.id === 'followup') {
          // For follow-up, we need recipientName and previousContext
          requestBody.recipientName = 'Recipient'; // TODO: Add input field
          requestBody.previousContext = 'Previous conversation'; // TODO: Add input field
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error('Failed to generate AI content');
        }

        const result = await response.json();
        
        if (result.success && result.email) {
          // Pre-populate the form with AI generated content
          setFormData(prev => ({
            ...prev,
            subject: result.email.subject || 'AI Generated Subject',
            body: result.email.body || 'AI Generated Body',
          }));
          
          console.log('✅ AI content loaded:', result.email);
        } else {
          throw new Error('Invalid response format from AI service');
        }
      } else {
        // Fallback to mock data if no assistant selected
        let mockSubject = '';
        let mockBody = '';
        
        if (prompt.toLowerCase().includes('sales') || prompt.toLowerCase().includes('business')) {
          mockSubject = 'Business Partnership Opportunity';
          mockBody = 'Hi there! I hope this email finds you well. I wanted to reach out about a potential business partnership that could benefit both our companies. Would you be interested in a brief call to discuss this further?';
        } else if (prompt.toLowerCase().includes('follow') || prompt.toLowerCase().includes('check')) {
          mockSubject = 'Following Up';
          mockBody = 'Hi! I hope you\'re doing well. I wanted to follow up on our previous conversation. Just checking in to see if you had any questions or if there\'s anything I can help you with.';
        } else {
          mockSubject = 'Email Regarding: ' + prompt;
          mockBody = 'Hi! I hope this email finds you well. I wanted to reach out regarding: ' + prompt + '. Please let me know if you have any questions or need additional information.';
        }

        setFormData(prev => ({
          ...prev,
          subject: mockSubject,
          body: mockBody,
        }));
      }
      
      if (selectedAssistant) {
        setSuccess(`AI ${selectedAssistant.name} generated content successfully! You can now edit and customize the email.`);
      } else {
        setSuccess('AI generated content successfully!');
      }
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('AI generation error:', err);
      setError('Failed to generate AI content: ' + err.message);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setFormData({ to: '', cc: '', bcc: '', subject: '', body: '' });
      setError('');
      setSuccess('');
      setSelectedAssistant(null);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { 
            height: 'fit-content',
            maxHeight: '90vh',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            overflow: 'hidden',
          }
        }}
      >
        {/* Compact Header */}
        <DialogTitle sx={{ 
          m: 0, 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MessageIcon color="primary" sx={{ fontSize: 20 }} />
            <Typography variant="h6" component="h1" sx={{ fontWeight: 500 }}>
              New Message
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            disabled={loading}
            size="small"
            sx={{ 
              color: 'text.secondary',
              '&:hover': { backgroundColor: 'action.hover' }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ p: 0, overflow: 'visible' }}>
            {/* Status Messages */}
            {error && (
              <Box sx={{ px: 2, pt: 1 }}>
                <Alert severity="error" sx={{ borderRadius: 1, fontSize: '0.875rem' }}>
                  {error}
                </Alert>
              </Box>
            )}
            {success && (
              <Box sx={{ px: 2, pt: 1 }}>
                <Alert severity="success" sx={{ borderRadius: 1, fontSize: '0.875rem' }}>
                  {success}
                </Alert>
              </Box>
            )}

            {/* Compact Form Layout */}
            <Box sx={{ p: 2 }}>
              {/* Recipients Row */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ minWidth: 60, color: 'text.secondary', fontWeight: 500 }}>
                  To:
                </Typography>
                <TextField
                  value={formData.to}
                  onChange={handleInputChange('to')}
                  fullWidth
                  required
                  disabled={loading}
                  size="small"
                  placeholder="recipient@example.com"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 36,
                      fontSize: '0.875rem',
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<AIIcon />}
                  onClick={() => setAiPickerOpen(true)}
                  disabled={loading || aiGenerating}
                  size="small"
                  sx={{ 
                    minWidth: 'auto', 
                    px: 2,
                    py: 0.5,
                    height: 36,
                    fontSize: '0.75rem',
                    borderRadius: 1.5,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    }
                  }}
                >
                  AI
                </Button>
              </Box>

              {/* CC Row */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ minWidth: 60, color: 'text.secondary', fontWeight: 500 }}>
                  CC:
                </Typography>
                <TextField
                  value={formData.cc}
                  onChange={handleInputChange('cc')}
                  fullWidth
                  disabled={loading}
                  size="small"
                  placeholder="cc@example.com"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 36,
                      fontSize: '0.875rem',
                    }
                  }}
                />
              </Box>

              {/* BCC Row */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ minWidth: 60, color: 'text.secondary', fontWeight: 500 }}>
                  BCC:
                </Typography>
                <TextField
                  value={formData.bcc}
                  onChange={handleInputChange('bcc')}
                  fullWidth
                  disabled={loading}
                  size="small"
                  placeholder="bcc@example.com"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 36,
                      fontSize: '0.875rem',
                    }
                  }}
                />
              </Box>

              {/* Subject Row */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ minWidth: 60, color: 'text.secondary', fontWeight: 500 }}>
                  Subject:
                </Typography>
                <Box sx={{ flex: 1, position: 'relative' }}>
                  <TextField
                    value={formData.subject}
                    onChange={handleInputChange('subject')}
                    fullWidth
                    required
                    disabled={loading}
                    size="small"
                    placeholder="Enter subject"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: 36,
                        fontSize: '0.875rem',
                      }
                    }}
                  />
                  {selectedAssistant && formData.subject && (
                    <Box sx={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}>
                      <AIIcon sx={{ fontSize: 16, color: selectedAssistant.color }} />
                      <Typography variant="caption" sx={{ color: selectedAssistant.color, fontWeight: 500 }}>
                        AI
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Divider */}
              <Divider sx={{ my: 2 }} />

              {/* Message Body */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Typography variant="body2" sx={{ minWidth: 60, color: 'text.secondary', fontWeight: 500, mt: 1 }}>
                  Message:
                </Typography>
                <Box sx={{ flex: 1, position: 'relative' }}>
                  <TextField
                    value={formData.body}
                    onChange={handleInputChange('body')}
                    fullWidth
                    multiline
                    rows={6}
                    required
                    disabled={loading}
                    placeholder="Type your message here..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: '0.875rem',
                        '& .MuiInputBase-input': {
                          paddingTop: '8px',
                          paddingBottom: '8px',
                        }
                      }
                    }}
                  />
                  {selectedAssistant && formData.body && (
                    <Box sx={{
                      position: 'absolute',
                      right: 8,
                      top: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      backgroundColor: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}>
                      <AIIcon sx={{ fontSize: 16, color: selectedAssistant.color }} />
                      <Typography variant="caption" sx={{ color: selectedAssistant.color, fontWeight: 500 }}>
                        AI
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* AI Generation Status */}
              {aiGenerating && (
                <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'primary.light', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} sx={{ color: 'white' }} />
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>
                    AI is generating content...
                  </Typography>
                </Box>
              )}
            </Box>
          </DialogContent>

          {/* Compact Actions */}
          <DialogActions sx={{ 
            p: 2, 
            pt: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}>
            <Button 
              onClick={handleClose} 
              disabled={loading}
              size="small"
              sx={{ 
                px: 2,
                py: 0.75,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SendIcon />}
              disabled={loading || !formData.to || !formData.subject || !formData.body}
              size="small"
              sx={{ 
                px: 3,
                py: 0.75,
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 1.5,
              }}
            >
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <AIAssistantPicker
        open={aiPickerOpen}
        onClose={() => setAiPickerOpen(false)}
        onSelectAssistant={handleAssistantSelect}
      />
      
      <AIPromptModal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onGenerate={handleAIGenerate}
      />
    </>
  );
};

export default ComposeEmail; 