import React from "react";
import { useParams } from "react-router-dom";
import ReactMarkDown from "react-markdown";
import axios from '../axios.js';

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const { id } = useParams();

  React.useEffect(() => {
    axios
    .get(`/posts/${id}`)
    .then(res => {
      setData(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.log(err);
      alert('Klaida, nepavyko gauti posto');
    });
  }, []);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `https://mern-blog-backend2.onrender.com${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        updatedAt={data.updatedAt}
        viewsCount={data.viewsCount}
        commentsCount={0}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkDown children={data.text} />
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Vartotojas 1",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Dar vienas testinis komentaras",
          },
          {
            user: {
              fullName: "Vartotojas 2",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "Irgi neturejom šiandien ką veikti",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
