import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp as SalesIcon,
  Refresh as FollowUpIcon,
  Close as CloseIcon,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';

const AIAssistantModal = ({ open, onClose, onGenerate }) => {
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientBusiness, setRecipientBusiness] = useState('');
  const [previousContext, setPreviousContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const assistants = [
    {
      id: 'sales',
      name: 'Sales Assistant',
      description: 'Generates sales emails, tailored to the recipient business description. (Keep the email under 40 words total. So it can be read under 10 seconds., max 7-10 words/sentence)',
      icon: SalesIcon,
      color: '#1976d2',
      fields: [
        { key: 'prompt', label: 'What should this email be about?', placeholder: 'e.g., Introduce our new SaaS product', required: true },
        { key: 'recipientBusiness', label: 'Recipient Business Description', placeholder: 'e.g., E-commerce company', required: true },
        { key: 'recipientName', label: 'Recipient Name', placeholder: 'e.g., John', required: true },
      ]
    },
    {
      id: 'followup',
      name: 'Follow-up Assistant',
      description: 'Specializes in generating polite follow-up emails (e.g., "just checking in").',
      icon: FollowUpIcon,
      color: '#2e7d32',
      fields: [
        { key: 'prompt', label: 'What should this follow-up be about?', placeholder: 'e.g., Check in on our proposal', required: true },
        { key: 'recipientName', label: 'Recipient Name', placeholder: 'e.g., Mike', required: true },
        { key: 'previousContext', label: 'Previous Context', placeholder: 'e.g., Sent proposal last week', required: true },
      ]
    }
  ];

  const handleAssistantSelect = (assistant) => {
    setSelectedAssistant(assistant);
    setError('');
  };

  const handleGenerate = async () => {
    if (!selectedAssistant || !prompt.trim()) return;

    setLoading(true);
    setError('');

    try {
      const data = {
        prompt: prompt.trim(),
        recipientName: recipientName.trim(),
      };

      if (selectedAssistant.id === 'sales') {
        data.recipientBusiness = recipientBusiness.trim();
      } else if (selectedAssistant.id === 'followup') {
        data.previousContext = previousContext.trim();
      }

      await onGenerate(selectedAssistant.id, data);
      handleClose();
    } catch (err) {
      setError('Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedAssistant(null);
    setPrompt('');
    setRecipientName('');
    setRecipientBusiness('');
    setPreviousContext('');
    setError('');
    onClose();
  };

  const canGenerate = selectedAssistant && 
    prompt.trim() && 
    recipientName.trim() && 
    (selectedAssistant.id === 'sales' ? recipientBusiness.trim() : previousContext.trim());

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AIIcon color="primary" />
          <Typography variant="h6" component="h1" sx={{ fontWeight: 500 }}>
            Choose AI Assistant
          </Typography>
        </Box>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{ minWidth: 'auto', p: 0.5 }}
        >
          <CloseIcon fontSize="small" />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        {!selectedAssistant ? (
          // Assistant Selection View
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select an AI assistant to help generate your email content:
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {assistants.map((assistant) => {
                const IconComponent = assistant.icon;
                return (
                  <Paper
                    key={assistant.id}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: 'transparent',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: assistant.color,
                        backgroundColor: `${assistant.color}08`,
                        transform: 'translateY(-1px)',
                      }
                    }}
                    onClick={() => handleAssistantSelect(assistant)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 2, 
                        backgroundColor: `${assistant.color}15`,
                        color: assistant.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 48,
                        height: 48,
                      }}>
                        <IconComponent sx={{ fontSize: 24 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: assistant.color, mb: 1 }}>
                          {assistant.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                          {assistant.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          </Box>
        ) : (
          // Form View for Selected Assistant
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Box sx={{ 
                p: 1, 
                borderRadius: 1.5, 
                backgroundColor: `${selectedAssistant.color}15`,
                color: selectedAssistant.color,
              }}>
                <selectedAssistant.icon sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: selectedAssistant.color }}>
                {selectedAssistant.name}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {selectedAssistant.fields.map((field) => (
                <Box key={field.key}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}>
                    {field.label}
                  </Typography>
                  <TextField
                    value={
                      field.key === 'prompt' ? prompt :
                      field.key === 'recipientName' ? recipientName :
                      field.key === 'recipientBusiness' ? recipientBusiness :
                      field.key === 'previousContext' ? previousContext : ''
                    }
                    onChange={(e) => {
                      if (field.key === 'prompt') setPrompt(e.target.value);
                      else if (field.key === 'recipientName') setRecipientName(e.target.value);
                      else if (field.key === 'recipientBusiness') setRecipientBusiness(e.target.value);
                      else if (field.key === 'previousContext') setPreviousContext(e.target.value);
                    }}
                    placeholder={field.placeholder}
                    fullWidth
                    size="small"
                    required={field.required}
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: 36,
                        fontSize: '0.875rem',
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
        {selectedAssistant && (
          <Button 
            onClick={() => setSelectedAssistant(null)}
            disabled={loading}
            size="small"
            sx={{ px: 2, py: 0.75 }}
          >
            Back
          </Button>
        )}
        <Button 
          onClick={handleClose}
          disabled={loading}
          size="small"
          sx={{ px: 2, py: 0.75 }}
        >
          Cancel
        </Button>
        {selectedAssistant && (
          <Button
            onClick={handleGenerate}
            variant="contained"
            disabled={!canGenerate || loading}
            size="small"
            sx={{ 
              px: 3, 
              py: 0.75,
              backgroundColor: selectedAssistant.color,
              '&:hover': { backgroundColor: selectedAssistant.color },
            }}
          >
            {loading ? 'Generating...' : 'Generate Email'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AIAssistantModal; 