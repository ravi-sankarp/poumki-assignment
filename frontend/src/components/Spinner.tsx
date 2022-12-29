import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';

function Spinner() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        overflowY: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}
    >
      <CircularProgress
        sx={{ overflow: 'hidden' }}
        color="primary"
      />
    </Box>
  );
}

export default Spinner;
