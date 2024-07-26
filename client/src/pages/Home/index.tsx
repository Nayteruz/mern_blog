import { ROUTES } from "@/shared/const/routes";
import { Link } from "react-router-dom";
import { CallToAction } from "../Post/CallToAction";
import { useEffect, useState } from "react";
import { IPost } from "@/shared/types";
import { PostCard } from "@/shared/UI/PostCard";

export const Home = () => {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getposts");
      const data = await res.json();

      if (res.ok) {
        setPosts(data.posts);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="">
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">
          Добро пожаловать в мой блог
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Здесь вы найдете разнообразные статьи и учебники по темам, таким как
          веб-разработка, программирование и языки программирования.
        </p>
        <Link
          to={ROUTES.SEARCH}
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          Посмотреть все посты
        </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">
              недавние посты
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={ROUTES.SEARCH}
              className="text-lg text-teal-500 hover:underline text-center"
            >
              Посмотреть все посты
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
