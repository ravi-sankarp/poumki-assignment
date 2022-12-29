import { styled } from '@mui/material';
import Tab from '@mui/material/Tab';

const TabStyled = styled((props: any) => (
  <Tab
    disableRipple
    {...props}
  />
))(() => ({
  textTransform: 'none',
  color: 'rgba(0, 0, 0, 0.7)',
  '&.Mui-selected': {
    color: '#000',
    backgroundColor: '#f5faff'
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#f5faff'
  }
}));
export default TabStyled;
