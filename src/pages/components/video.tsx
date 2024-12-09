import ReactPlayer from 'react-player'
import Box from '@mui/material/Box';

export default function Video(props:any) {
  const {url, height = 'auto'} = props;
  return (
    <Box>
      <ReactPlayer
        url={url}
        width="100%"
        loop
        muted
        controls={true}
        playing
        height={height}
      />
    </Box>
  )
}
