import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';
import { useEmailContext } from '../context/EmailContext';

const EmailSidebar = ({ onEmailSelect }) => {
  const { emails, loading, error } = useEmailContext();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <Paper sx={{ width: 320, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ width: 320, height: '100%', p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: 320, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component="h1">
          Mail
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {emails.length} emails
        </Typography>
      </Box>

      {/* Email List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ p: 0 }}>
          {emails.map((email, index) => (
            <React.Fragment key={email.id || index}>
              <ListItem 
                button 
                onClick={() => onEmailSelect(email)}
                sx={{
                  '&:hover': { backgroundColor: 'action.hover' },
                  px: 2,
                  py: 1.5,
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <EmailIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" noWrap>
                      {email.to || 'Unknown Recipient'}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" noWrap color="text.primary">
                        {email.subject || 'No Subject'}
                      </Typography>
                      <Typography variant="caption" noWrap color="text.secondary">
                        {truncateText(email.body)}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {formatDate(email.created_at || new Date())}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < emails.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default EmailSidebar; 