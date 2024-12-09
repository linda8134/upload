import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {useParams} from 'react-router-dom';
import 'instantsearch.css/themes/satellite.css';
import {useEffect, useCallback, useState} from 'react';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import {styled} from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import BackTo from '../components/Back';
import AddComment from '../post/comment';
import Video from '../components/video';

export default function Detail(){
  const [detail, setDetail] = useState([]);
  const {id = ''} = useParams()
  const fetchData = useCallback(async () => {
    if(!id){
      return 
    }
    const result = await fetch(`http://localhost:7700/multi-search`, {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization:'Bearer 123456'
      },
      body:JSON.stringify(
        {
          queries:[
            {
              attributesToSearchOn: ['id'],
              attributesToHighlight:['*'],
              highlightPostTag: "__/ais-highlight__",
              highlightPreTag: "__ais-highlight__",
              indexUid:'bvideo',
              limit: 1,
              offset:0,
              q:`${id}`
            }
          ]
        }
      )
    })
    const data = await result.json();
    setDetail(data.results[0].hits?.find(item => item.id === Number(id)))
  },[id])

  console.log('detail', detail);

  useEffect(() => {
    if(!id){
      return;
    }
    fetchData();
  },[id])
  return (
    <Box className='space-y-8'>
      <BackTo />
      <Box className='space-y-4'>
        <Typography variant="h3">{detail?.title}</Typography>
        <Box className='flex items-center space-x-2'>
          {detail?.author_nickname ? (
            <Typography>{detail?.author_nickname}</Typography>
          ) : null}
          <Typography color='text.secondary'>{dayjs(Number(detail.created_time)*1000).format('YYYY-MM-DD HH:mm:ss')}</Typography>
        </Box>
        <Typography variant="body1"><Video url={detail.url} height={300}/></Typography>
      </Box>
      <Divider/>
      <Comment id={id}/>
    </Box>
  )
}

const Comment = ({id = ''}) => {
  const [addComment, setAddComment] = useState(false);
  const [comments, setComments] = useState([]);
  const fetchData = useCallback(async () => {
    if(!id){
      return 
    }
    const result = await fetch(`http://localhost:7700/multi-search`, {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization:'Bearer 123456'
      },
      body:JSON.stringify(
        {
          queries:[
            {
              attributesToSearchOn: ['video_id'],
              attributesToHighlight:['*'],
              highlightPostTag: "__/ais-highlight__",
              highlightPreTag: "__ais-highlight__",
              indexUid:'bcomment',
              limit: 30,
              offset:0,
              q:`${id}`,
              showRankingScore: true
            }
          ]
        }
      )
    })
    const data = await result.json();
    console.log('comment', data);
    setComments(data.results[0].hits?.filter(comment => comment.video_id === Number(id)).reverse())
  },[id])
  useEffect(() => {
    if(!id){
      return;
    }
    fetchData();
  },[id, addComment])
  return (
    <Box className='space-y-4'>
      <Box className='flex justify-between items-center'>
        <Typography variant='body1'>Comments</Typography>
        <Button size='small' color='secondary' variant='contained' onClick={() => setAddComment(true)}>Comment</Button>
      </Box>
      {addComment ? (
        <AddComment 
          id={id}
          onClose={() => setAddComment(false)}
          refresh={fetchData}
        />
      ) : null}
      {!comments.length ? (
        <Divider />
      ) : null}
      <Box className='space-y-3'>
        {comments.length ? (
          comments.map(comment => {
            return <Hit hit={comment}/>
          })
    
        ) : (
          <Box className='flex justify-center flex-col items-center space-y-3'>
            <Typography>No Comments</Typography>
            <Button size='small' variant='contained' onClick={() => setAddComment(true)}>Comment</Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

const Hit = ({ hit:item }) => {
  return (
    <Box key={item?.id} className='space-y-2 w-full border border-t-1 border-b-0 border-r-0 border-l-0 pt-3 border-divider'>
      <Typography noWrap variant='h3'>{item?.title}</Typography>
      <Box className='w-full flex items-center justify-between'>
        <Box className='flex items-center space-x-2'>
          {item?.author_nickname ? (
            <Typography>{item?.author_nickname}</Typography>
          ) : null}
          <Typography color='text.secondary'>{dayjs(Number(item?.created_time)*1000).format('YYYY-MM-DD HH:mm:ss')}</Typography>
        </Box>
      </Box>
      <StyleDetail>{item?.content}</StyleDetail>
    </Box>
  )
};

const StyleDetail = styled(Typography)`
display: -webkit-box;
-webkit-line-clamp: 3;
-webkit-box-orient: vertical;  
overflow: hidden;
`