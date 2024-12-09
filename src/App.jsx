import {Route, Routes } from 'react-router-dom';
import Layout from './layout';
import Index from './pages/index';
import ArticleDetail from './pages/detail'
import Post from './pages/post';
import Comment from './pages/post/comment'
import Subspace from './pages/post/subspace'
import Dropbox from './pages/index/dropBox';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Index />}/>
        <Route path='/drop' element={<Dropbox />}/>
        <Route path="/detail" element={<ArticleDetail />}>
          <Route path=":id" element={<ArticleDetail />}/>
        </Route>
        <Route path='/upload' element={<Post />} />
        <Route path='/comment' element={<Comment />}>
          <Route path=":id" element={<Comment />} />
        </Route>
        <Route path='/subspace' element={<Subspace />} />
      </Routes>
    </Layout>
  )
};

export default App
