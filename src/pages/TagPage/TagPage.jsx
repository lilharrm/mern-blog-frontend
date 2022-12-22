import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Navigate, useParams } from "react-router-dom";

import { Post } from '../../components/Post';
import { selectIsAuth } from '../../redux/slices/auth';
import { TagsBlock } from '../../components/TagsBlock';
import { fetchPosts, fetchTags } from '../../redux/slices/posts';

export const TagPage = () => {
  const [tabValue, setTabValue] = React.useState("New");

  const handleChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const isAuth = useSelector(selectIsAuth);
  const { id } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);

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
      <Tabs style={{ marginBottom: 15 }} value={tabValue} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="Naujausi" value={"New"} />
        <Tab label="Populiariausi" value={"Popular"} />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).filter(obj => obj?.tags.includes(id)).sort((a, b) => {
            if (tabValue === "New") {
              const aDate = new Date(a.createdAt)
              const bDate = new Date(b.createdAt)

              return bDate?.getTime() - aDate?.getTime()
            }
            return b?.viewsCount - a?.viewsCount
          }).map((obj, index) => (isPostsLoading ? <Post key={index} isLoading={true} /> :
            <Post
              id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
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
        <Grid xs={4} item>
          <div style={{ position: "sticky", top: "15px" }}>
            <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          </div>
        </Grid>
      </Grid>
    </>
  );
};
