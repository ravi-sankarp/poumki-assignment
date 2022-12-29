import { InputBase, styled } from '@mui/material';

const InputField = styled(InputBase)({

  width: '100%',
  height: '40px',
  outline: 'none',
  fontSize: '16px',
  borderRadius: '4px',
  backgroundColor: 'rgb(249, 250 ,251)',
  border: '2px solid #ddd',
  paddingLeft: 11,
  '&:hover': {
    border: '2px solid #4d4d4d'
  },
  '&:focus-within': {
    border: '2px solid #000',
    transition: 'all 100ms ease-in'
  },
  '&>input::placeholder': {
    fontSize: '14px'
  }
});

export default InputField;
