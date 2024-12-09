import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { stringToHex } from '@polkadot/util'
import {useWalletContext} from '../../context/WalletProvider';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {keys} from 'lodash'
import {useMemo, useState} from 'react';
import {BitVideoCommentSchema} from '../../constants/scaleCodec';
import {u8aToHex} from '@polkadot/util';
import {nodeKey} from '../../constants';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import Loading from '@mui/material/CircularProgress';
import dayjs from 'dayjs';

export default function Comment(props){
  const {id = '', onClose, refresh} = props;
  const [loading, setLoading] = useState(false)
  const {address, wallet} = useWalletContext();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      id:BigInt(0),
      video_id:BigInt(id),
      user_id:BigInt(0),
      content:'',
      created_time:BigInt(0),
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const {values} = formik;

  const codecValue = useMemo(() => {
    const params = {
      ...values,
      id: BigInt(values.id),
      user_id:BigInt(values.user_id),
      video_id: BigInt(values.video_id),
      created_time: BigInt(dayjs().unix()),
    }
    try{
      const decodeValue = u8aToHex(BitVideoCommentSchema.encode(params))
      return decodeValue
    }catch(error){
      return ''
    }
  },[values])


  const signMessage = async () => {
    setLoading(true)
    const signRaw = wallet.signer?.signRaw;
    if (signRaw) {
      const { signature } = await signRaw({
        address: address,
        data: stringToHex('message'),
        type: 'bytes',
      })
      console.log('signature', signature)
      const params = [nodeKey, 'add_comment', codecValue.slice(2)]
      //const signatureParams = {...params, account_address: address, msg: 'message', signature}
      sendPost(params);
      return signature
    } else {
      return ''
    }
  }
  
  const sendPost = async (params) => {
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
      setTimeout(() => {
        setLoading(false)
        toast.success('评论成功！')
        navigate(`/detail/${id}`)
        refresh();
        onClose();
      },3000)
    })
  }

  return (
    <Box className='space-y-4'>
      <Box className='space-y-4'>
        {keys(values).filter(item => !['id', 'video_id', 'user_id', 'author_nickname', 'article_id', 'created_time', 'status', 'weight'].includes(item)).map(item => {
          return (
            <OutlinedInput
              key={item}
              rows={5}
              multiline
              fullWidth
              id={item}
              name={item}
              placeholder={item}
              value={formik.values[item]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched[item] && Boolean(formik.errors[item])}
              helperText={formik.touched[item] && formik.errors[item]}
            />
          )
        })}
        <Box className='flex justify-end space-x-4'>
          <Button onClick={onClose} variant='outlined' size='small'>Cancel</Button>
          <Button 
            onClick={signMessage} 
            variant='contained' 
            size='small' 
            endIcon={loading ? <Loading color='inherit' fontSize='inherit' size={16}/> : null}
            disabled={!values.content || loading}
          >Post</Button>
        </Box>
      </Box>
    </Box>
  )
}

const validationSchema = yup.object({
  content: yup
    .string('content'),
  is_public: yup
    .boolean('Is public')
    .required('Is public'),
});
