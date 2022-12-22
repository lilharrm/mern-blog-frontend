import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Navigate } from "react-router-dom";

import { Post } from '../components/Post';
import { selectIsAuth } from '../redux/slices/auth';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';
import ClockContainer from '../components/ClockContainer/ClockContainer';

export const Home = (props) => {
  const [tabValue, setTabValue] = React.useState("New");

  const handleChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags, comments } = useSelector((state) => state.posts);

  const postItems = [...posts?.items];

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, []);

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid xs={2.5} item>
          <div style={{ position: "sticky", marginTop: "63px", top: "15px", display: "flex", justifyContent: "center" }}>
            <ClockContainer />
          </div>
        </Grid>
        <Grid xs={6.5} item>
          <Tabs style={{ marginBottom: 15 }} value={tabValue} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Naujausi" value={"New"} color="primary" />
            <Tab label="Populiariausi" value={"Popular"} inkBarStyle={{ color: "red !important" }} />
          </Tabs>
          {(isPostsLoading ? [...Array(5)] : postItems.sort((a, b) => {
            if (tabValue === "New") {
              const aDate = new Date(a.createdAt)
              const bDate = new Date(b.createdAt)

              return bDate?.getTime() - aDate?.getTime()
            }
            return b?.viewsCount - a?.viewsCount
          })).map((obj, index) => (isPostsLoading ? <Post key={index} isLoading={true} /> :
            <Post
              id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl ? `process.env.REACT_APP_API_URL${obj.imageUrl}` : ''}
              user={obj.user}
              createdAt={obj.createdAt}
              updatedAt={obj.updatedAt}
              viewsCount={obj.viewsCount}
              commentsCount={0}
              tags={obj.tags}
              isEditable={userData?._id === obj?.user?._id}
            />
          ))}
        </Grid>
        <Grid xs={3} item>
          <div style={{ position: "sticky", marginTop: "63px", top: "15px" }}>
            <TagsBlock items={tags.items} isLoading={isTagsLoading} />
            <CommentsBlock
              items={[
                {
                  user: {
                    fullName: 'Vartotojas 1',
                    avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                  },
                  text: 'Testinis komentaras',
                },
                {
                  user: {
                    fullName: 'Vartotojas 2',
                    avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                  },
                  text: 'Sveiki, kaip šiandienos nuotaiką?',
                },
              ]}
              isLoading={false}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
};
