import { InstantSearch, SearchBox, InfiniteHits, Configure } from 'react-instantsearch';
import 'instantsearch.css/themes/satellite.css';
import dayjs from 'dayjs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {useNavigate} from 'react-router-dom'
import {useArticleContext} from '../../context/ArticlesContext';
import {styled} from '@mui/material/styles';
import './index.css'
import Video from '../components/video';
import Favorite from '@mui/icons-material/Favorite'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import IconButton from '@mui/material/IconButton';
import {BitVideoLikeSchema} from '../../constants/scaleCodec'
import {u8aToHex, stringToHex} from '@polkadot/util';
import {useWalletContext} from '../../context/WalletProvider';
import {nodeKey} from '../../constants';


const App = () => {
  const {client} = useArticleContext()
  return (
    <Box className='w-full'>
      <InstantSearch
        indexName="bvideo"
        searchClient={client}
      >
        <Configure 
          hitsPerPage={50} 
          //filters="author_nickname=lindawu"
        />
        <Box className='space-y-6'>
          <Box className='flex items-center justify-between'>
            <SearchBox className='w-1/2'/>
          </Box>
          <Box className=''>
            <InfiniteHits
              showPrevious={false}
              hitComponent={Hit}
            />
          </Box>
        </Box>
      </InstantSearch>
    </Box>
  )
};

const Hit = ({ hit:item }) => {
  const {address, wallet} = useWalletContext();
  const navigate = useNavigate()
  const signMessage = async (message) => {
    const signRaw = wallet.signer?.signRaw;
    if (signRaw) {
      const { signature } = await signRaw({
        address: address,
        data: stringToHex('message'),
        type: 'bytes',
      })
      const params = [nodeKey, 'add_like', message.slice(2)]
      //const signatureParams = {...params, account_address: address, msg: 'message', signature}
      sendLike(params);
      return signature
    } else {
      return ''
    }
  }
  
  const sendLike = async (params) => {
    fetch('http://localhost:9944', {
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        "jsonrpc":"2.0", 
        "id": "whatever",
        method:'nucleus_post',
        params: params
      })
    }).then(resp => {
      window?.reload()
    })
  }

  const handleFollow = (id) => {
    let message = '';
    const params = {
      id: BigInt(0),
      user_id:BigInt(0),
      video_id: BigInt(id),
      likenum: BigInt(1),
      created_time: BigInt(dayjs().unix()),
    }
    try{
      message = u8aToHex(BitVideoLikeSchema.encode(params))
    }catch(error){
      console.log(error);
    }
    signMessage(message)
  }

  const handleToDetail = (id) => {
    navigate(`/detail/${id}`)
  }

  return (
    <Box key={item?.id} className='space-y-2 w-full' onClick={() => handleToDetail(item.id)}>
      <StyleDetail>
        <Video url={item.url} />
      </StyleDetail>
      <Typography noWrap variant='h5' fontWeight={600}>{item.title}</Typography>
      <Box className='w-full flex items-center justify-between'>
        <Box className='flex items-center space-x-2'>
          {item?.author_nickname ? (
            <Typography>{item?.author_nickname}</Typography>
          ) : null}
          <Typography color='text.secondary'>{dayjs(Number(item.created_time)*1000).format('YYYY-MM-DD HH:mm:ss')}</Typography>
        </Box>
        <Box className="flex items-center space-x-1">
          {/* <span>{item.total_likes}</span> */}
          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              handleFollow(item?.id)
            }}
            color={
              true ? 'error' : 'inherit'
            }
            sx={{ padding: `4px` }}
          >
            {true ? (
              <Favorite />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
};
export default App


const StyleDetail = styled(Typography)`
display: -webkit-box;
-webkit-line-clamp: 3;
-webkit-box-orient: vertical;  
overflow: hidden;
`