import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Header from './header';
import {styled} from '@mui/material';
import Footer from './footer';

const StyledRoot = styled(Box)`
  width: 100vw;
  height: 100vh;
  background: ${({theme}) => theme.palette.background.default};
  color: ${({theme}) => theme.palette.text.primary};
  overflow-x: hidden;
`

const StyledContent = styled(Container)``

export default function Layout(props){
  return (
    <StyledRoot className='space-y-4 flex flex-col'>
      <Header/>
      <StyledContent className='flex-grow'>
        {props.children}
      </StyledContent>
      {/* <Footer /> */}
    </StyledRoot>
  )
}