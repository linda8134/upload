import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import {useWalletContext} from '../context/WalletProvider'
import Button from '@mui/material/Button';
import {Link, NavLink} from 'react-router-dom';
import Chip from '@mui/material/Chip';
import rustLogo from '../assets/rust-logo.svg'


export default function Header(){
  const {handleConnect, address, disconnected} = useWalletContext()
  return (
    <Paper className="flex justify-between items-center p-3 px-5">
      <Box>
        <Box className='flex items-center space-x-1' component={Link} to='/'>
          <span className='text-lg'>Video Upload</span>
        </Box>
      </Box>
      <Box className='flex items-center space-x-6'>
        <NavLink to="/upload" className={({isActive}) => isActive ? 'text-secondary font-bold hover:text-secondary' : 'hover:text-secondary'}>Upload</NavLink>
        {address ? (
          <Chip 
            label={`${address.slice(0,5)}...${address.slice(-5)}`}
            className='cursor-pointer' onClick={disconnected}
            color='primary' 
          />
        ) : (
          <Button onClick={handleConnect} variant='contained' color='primary'>Connect wallet</Button>
        )}
      </Box>
    </Paper>
  )
}