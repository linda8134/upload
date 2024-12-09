import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { stringToHex } from '@polkadot/util'
import {useWalletContext} from '../../context/WalletProvider';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {keys} from 'lodash'
import {ArticleSechma, BitVideoSchema} from '../../constants/scaleCodec';
import {u8aToHex} from '@polkadot/util'
import {useMemo, useState} from 'react';
import {nodeKey} from '../../constants';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import BackTo from '../components/Back';
import Loading from '@mui/material/CircularProgress';
import {useArticleContext} from '../../context/ArticlesContext';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import dayjs from 'dayjs';


export default function Post(){
  const {address, wallet} = useWalletContext()
  const {subspaceList = []} = useArticleContext();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues: {
      'id':BigInt(1),
      'title':'',
      'description':'',
      'url':'https://www.youtube.com/watch?v=A_Ca2jxhmyY',
      'banner':'',
      'created_time':BigInt(123456),
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
      created_time: BigInt(dayjs().unix()),
    }
    try{
      const decodeValue = u8aToHex(BitVideoSchema.encode(params))
      return decodeValue
    }catch(error){
      return ''
    }
  },[values])

  console.log('codec value', codecValue, codecValue.slice(2), JSON.stringify([nodeKey, 'add_video', codecValue.slice(2)]))

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
      const params = [nodeKey, 'add_video', codecValue.slice(2)]
      //const signatrueParams = {...params, account_address: address, msg: 'message', signature}
      sendPost(params)
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
        params:params
      })
    }).then(resp => {
      setTimeout(() => {
        setLoading(false)
        toast.success('发布成功！')
        navigate(`/`)
      },5000)
    })
  }

  return (
    <Container maxWidth="md" className='space-y-6'>
      <BackTo currentTag={<Typography color='inherit'>Post</Typography>}/>
      <Box className='space-y-4'>
        {/* <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={formik.values.subspace_id}
            onChange={(e) => {
              setFieldValue('subspace_id', BigInt(e.target.value))
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.subspace_id && Boolean(formik.errors.subspace_id)}
            helperText={formik.touched.subspace_id && formik.errors.subspace_id}
          >
            {subspaceList.map(item => {
              return (
                <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
              )
            })}
          </Select>
        </FormControl> */}
        {keys(values).filter(item => !['id', 'author_id', 'author_nickname', 'subspace_id', 'created_time', 'updated_time', 'status', 'weight'].includes(item)).map(item => {
          return (
            <OutlinedInput
              rows={15}
              multiline={item === 'content'}
              key={item}
              fullWidth
              id={item}
              name={item}
              color='primary'
              placeholder={item}
              value={formik.values[item]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched[item] && Boolean(formik.errors[item])}
              helperText={formik.touched[item] && formik.errors[item]}
            />
          )
        })}
        <Button 
          onClick={signMessage} 
          variant='contained' 
          size='large'
          endIcon={loading ? <Loading color='inherit' fontSize='inherit' size={16}/> : null}
          disabled={!values.url || !values.title || loading}
        >Post</Button>
      </Box>
    </Container>
  )
}

const validationSchema = yup.object({
});