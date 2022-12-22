import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import Container from "@mui/material/Container";

import styles from "./app.module.scss"

import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login, TagPage } from "./pages";
import React from 'react';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';

function App() {
  const [displayMode, setDisplayMode] = React.useState(window.localStorage.getItem("displayMode") || "light")

  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  const containerStyles = displayMode === 'dark' ?  `${styles.container} ${styles.container__darkMode}` : styles.container;
  return (
    <>
      <Header displayMode={displayMode} setDisplayMode={setDisplayMode} />
      <div className={containerStyles}>
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" displayMode={displayMode} element={<Home />} />
            <Route path="/tags/:id" element={<TagPage />} />
            <Route path="/posts/:id" element={<FullPost />} />
            <Route path="/posts/:id/edit" element={<AddPost />} />
            <Route path='/add-post' element={<AddPost />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Registration />} />
          </Routes>
        </Container>
      </div>
    </>
  );
}

export default App;
