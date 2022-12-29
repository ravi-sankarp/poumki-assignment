import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import ErrorField from '../Styled/ErrorFieldStyled';
import InputField from '../Styled/InputFieldStyled';
import PrimaryButton from '../Styled/PrimaryButton';

function TaskTab() {
  const [string, setString] = useState('');
  const [revString, setRevString] = useState('');
  const [error, setError] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setString(e.target.value);
  };
  const handleReverse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!string) {
      setError('Please enter a value');
      return;
    }
    const checkIsAlphabet = (char: string) => {
      return (char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z');
    };
    const str = string.split('');
    let i = 0,
      j = str.length - 1;
    while (i < j) {
      if (!checkIsAlphabet(str[i])) {
        i++;
      } else if (!checkIsAlphabet(str[j])) {
        j--;
      } else {
        [str[i], str[j]] = [str[j], str[i]];
        i++;
        j--;
      }
    }
    setRevString(str.join(''));
  };
  return (
    <div>
      <Typography
        variant="h4"
        align="center"
      >
        Tasks
      </Typography>
      <Typography
        sx={{ mt: 4, mb: 1 }}
        variant="h6"
        align="center"
      >
        Enter a string to reverse
      </Typography>

      <Box
        component="form"
        autoComplete="off"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}
        onSubmit={handleReverse}
      >
        <InputField
          onChange={handleChange}
          value={string}
          name="string"
          placeholder="Enter a string"
          inputProps={{ 'aria-label': 'string' }}
        />
        <ErrorField>{error}</ErrorField>
        <PrimaryButton
          type="submit"
          sx={{ mx: 'auto' }}
        >
          Reverse
        </PrimaryButton>
        <Typography variant="h6">
          {revString ? `The reversed string is ${revString}` : ''}
        </Typography>
      </Box>
    </div>
  );
}

export default TaskTab;
