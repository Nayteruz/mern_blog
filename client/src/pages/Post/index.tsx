import { ROUTES } from "@/shared/const/routes";
import { IPost } from "@/shared/types";
import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export const Post = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState<IPost | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(false);

      try {
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();

        if (!res.ok) {
          setError(true);
          return;
        }

        if (res.ok) {
          setPost(data.posts[0]);
        }
      } catch (error) {
        setError(true);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center flex-1">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl w-full mx-auto flex-1">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post.title}
      </h1>
      <Link
        to={`${ROUTES.SEARCH}?category=${post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post.category}
        </Button>
      </Link>
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="mt-10 p-3 max-h-[600px] w-full object-cover"
        />
      )}
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post.content.length.toFixed(0)} мин. чтения
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
    </main>
  );
};
