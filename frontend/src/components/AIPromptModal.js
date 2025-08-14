import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Chip,
} from '@mui/material';
import { AutoAwesome as AIIcon } from '@mui/icons-material';

const AIPromptModal = ({ open, onClose, onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      await onGenerate(prompt.trim());
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setPrompt('');
      onClose();
    }
  };

  const examplePrompts = [
    'Meeting request for Tuesday',
    'Sales pitch for software company',
    'Follow up on previous conversation',
    'Business partnership proposal',
    'Thank you email after meeting',
  ];

  const handleExampleClick = (example) => {
    setPrompt(example);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AIIcon color="primary" />
        AI Email Assistant
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Describe what you want your email to be about. Our AI will generate a professional email for you.
        </Typography>

        <TextField
          autoFocus
          label="What should this email be about?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          fullWidth
          multiline
          rows={3}
          placeholder="e.g., Meeting request for Tuesday, Sales pitch for software company..."
          disabled={loading}
          sx={{ mb: 2 }}
        />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Example prompts:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {examplePrompts.map((example, index) => (
            <Chip
              key={index}
              label={example}
              size="small"
              variant="outlined"
              onClick={() => handleExampleClick(example)}
              disabled={loading}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>

        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Sales Assistant:</strong> Generates sales emails (under 40 words, 7-10 words/sentence)<br/>
            <strong>Follow-up Assistant:</strong> Creates polite follow-up emails
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<AIIcon />}
          disabled={!prompt.trim() || loading}
        >
          {loading ? 'Generating...' : 'Generate Email'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AIPromptModal; 