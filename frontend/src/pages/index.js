import { useState, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import EmailSidebar from '../components/EmailSidebar';
import EmailViewer from '../components/EmailViewer';
import ComposeEmail from '../components/ComposeEmail';
import { EmailProvider } from '../context/EmailContext';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export default function Home() {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isComposing, setIsComposing] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EmailProvider>
        <Box sx={{ display: 'flex', height: '100vh', position: 'relative' }}>
          <EmailSidebar 
            onEmailSelect={setSelectedEmail}
          />
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {selectedEmail ? (
              <EmailViewer email={selectedEmail} />
            ) : (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: 'text.secondary'
              }}>
                Select an email from the sidebar to view
              </Box>
            )}
          </Box>
          
          {/* Fixed Compose Button - Bottom Right Corner */}
          <Fab
            color="primary"
            aria-label="compose"
            onClick={() => setIsComposing(true)}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
              width: 56,
              height: 56,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <AddIcon />
          </Fab>

          {isComposing && (
            <ComposeEmail 
              open={isComposing}
              onClose={() => setIsComposing(false)}
            />
          )}
        </Box>
      </EmailProvider>
    </ThemeProvider>
  );
}
