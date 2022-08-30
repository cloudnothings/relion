import React, { useEffect } from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from "../lib/prisma";
import { useSession } from "next-auth/react";
export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { feed },
    revalidate: 10,
  };
};

type Props = {
  feed: PostProps[];
};

const Blog: React.FC<Props> = (props) => {
  const { data: session, status } = useSession();
  let view = (
    <Layout>
      <></>
    </Layout>
  );

  if (status === "loading")
    view = (
      <Layout>
        <>Loading</>
      </Layout>
    );

  if (session)
    view = (
      <Layout>
        <div className="page">
          <h1>Public Feed</h1>
          <main>
            {props.feed.map((post) => (
              <div key={post.id} className="post">
                <Post post={post} />
              </div>
            ))}
          </main>
        </div>
        <style jsx>{`
          .post {
            background: white;
            transition: box-shadow 0.1s ease-in;
          }

          .post:hover {
            box-shadow: 1px 1px 3px #aaa;
          }

          .post + .post {
            margin-top: 2rem;
          }
        `}</style>
      </Layout>
    );
  return <>{view}</>;
};

export default Blog;
