import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import {
  TrendingUp as SalesIcon,
  Refresh as FollowUpIcon,
  Close as CloseIcon,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';

const AIAssistantPicker = ({ open, onClose, onSelectAssistant }) => {
  const assistants = [
    {
      id: 'sales',
      name: 'Sales Assistant',
      description: 'Generates sales emails, tailored to the recipient business description. (Keep the email under 40 words total. So it can be read under 10 seconds., max 7-10 words/sentence)',
      icon: SalesIcon,
      color: '#1976d2',
      bgColor: '#e3f2fd',
    },
    {
      id: 'followup',
      name: 'Follow-up Assistant',
      description: 'Specializes in generating polite follow-up emails (e.g., "just checking in").',
      icon: FollowUpIcon,
      color: '#2e7d32',
      bgColor: '#e8f5e8',
    }
  ];

  const handleAssistantSelect = (assistant) => {
    onSelectAssistant(assistant);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
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
          onClick={onClose}
          sx={{ minWidth: 'auto', p: 0.5 }}
        >
          <CloseIcon fontSize="small" />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
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
                  p: 2.5,
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: 'transparent',
                  backgroundColor: assistant.bgColor,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: assistant.color,
                    backgroundColor: `${assistant.color}08`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 20px ${assistant.color}20`,
                  }
                }}
                onClick={() => handleAssistantSelect(assistant)}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 3, 
                    backgroundColor: 'white',
                    color: assistant.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 56,
                    height: 56,
                    boxShadow: `0 2px 8px ${assistant.color}30`,
                  }}>
                    <IconComponent sx={{ fontSize: 28 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: assistant.color, mb: 1.5 }}>
                      {assistant.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {assistant.description}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button 
          onClick={onClose}
          size="small"
          sx={{ px: 2, py: 0.75 }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AIAssistantPicker; 