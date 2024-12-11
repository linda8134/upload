import {Dropbox} from 'dropbox'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React, {useState} from 'react';
import Loading from '@mui/material/CircularProgress';



const ACCESS_TOKEN=""
const dbx = new Dropbox({ accessToken: ACCESS_TOKEN });

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function InputFileUpload(props) {
  const [uploading, setUploading] = useState(false)
  const {handleUploadResult} = props;
  const getFileLockPath = (video:any) => {
    return dbx.sharingCreateSharedLinkWithSettings({
      path: video?.path_display,
      "settings": {
        "access": "viewer",
      }
    })
  }
  
  const handleUpload = async (event) => {
    const files = event.target.files;
    var file = files[0];
    setUploading(true)
    const resp = await dbx.filesUpload({path: '/test-video/' + file.name, contents: file})
      .then((response) => {
        console.log('resp', response);
        return getFileLockPath(response?.result);
      })
      .catch(function(error) {
        console.error(error.error || error);
      });
    console.log(resp, 'resp');
    handleUploadResult(resp?.result)
    setUploading(false)
  }
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      disabled={uploading}
      endIcon={uploading ? (<Loading color='inherit' size={16}/>) : null}
    >
      Upload files
      <VisuallyHiddenInput
        type="file"
        onChange={handleUpload}
        multiple
      />
    </Button>
  );
}