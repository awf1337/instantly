import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Reply as ReplyIcon,
  Forward as ForwardIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

const EmailViewer = ({ email }) => {
  if (!email) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Email Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            {email.subject || 'No Subject'}
          </Typography>
          <Box>
            <Tooltip title="Reply">
              <IconButton size="small">
                <ReplyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Forward">
              <IconButton size="small">
                <ForwardIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Email Meta */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <EmailIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" color="text.primary">
              From: {email.from || 'Unknown Sender'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(email.created_at || new Date())}
            </Typography>
          </Box>
        </Box>

        {/* Recipients */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {email.to && (
            <Chip
              label={`To: ${email.to}`}
              size="small"
              variant="outlined"
              color="primary"
            />
          )}
          {email.cc && (
            <Chip
              label={`CC: ${email.cc}`}
              size="small"
              variant="outlined"
              color="secondary"
            />
          )}
          {email.bcc && (
            <Chip
              label={`BCC: ${email.bcc}`}
              size="small"
              variant="outlined"
              color="default"
            />
          )}
        </Box>
      </Box>

      {/* Email Body */}
      <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
        <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
          {email.body || 'No content'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default EmailViewer; 