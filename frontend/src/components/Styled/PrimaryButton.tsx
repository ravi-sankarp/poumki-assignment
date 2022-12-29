import { Button, styled } from '@mui/material';

const PrimaryButton = styled(Button)({
  textTransform: 'none',
  fontSize: '.875rem',
  width: 'max-content',
  fontWeight: 500,
  margin: '.25rem auto',
  padding: '6px 1.25rem',
  lineHeight: '1.55rem',
  borderRadius: '.3rem',
  maxHeight: '2rem',
  borderWidth: '1px',
  borderColor: 'rgb(209 213 219)',
  backgroundColor: '#1a56db',
  color: '#fff',
  zIndex: 1,
  '&:hover': {
    backgroundColor: '#1545af',
    color: '#fff',
    transition: 'all 300ms '
  },
  '&:active': {
    top: '2px',
    transition: 'top 200ms ease-in'
  },
  '&:focus': {
    boxShadow: '0.2 0.2 0.2 0.2rem #000'
  },
  '&:disabled': {
    backgroundColor: 'rgba(0,0,0,0.2) ',
    color: '#000 ',
    pointerEvents: 'auto ',
    cursor: 'not-allowed '
  }
});

export default PrimaryButton;
