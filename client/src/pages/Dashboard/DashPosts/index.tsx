import useStore from "@/app/store/store.zustand";
import { IFetchError, IFetchPosts, IPost } from "@/shared/types";
import { PopupConfirm } from "@/shared/UI/PopupConfirm";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MAX_POSTS = 9;

export const DashPosts = () => {
  const { currentUser } = useStore();
  const [userPosts, setUserPosts] = useState<IPost[]>([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  const onShowMore = async () => {
    const startIndex = userPosts.length;

    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser?._id}&startIndex=${startIndex}`,
      );
      const data = await res.json();

      if (res.ok) {
        setUserPosts((prevPosts) => [...prevPosts, ...data.posts]);
        if (data.posts.length < MAX_POSTS) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async () => {
    setShowModal(false);

    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser?._id}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (res.ok) {
        setUserPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postIdToDelete),
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      const err = error as IFetchError;
      console.log(err.message);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `/api/post/getposts?userId=${currentUser?._id}&limit=${MAX_POSTS}`,
        );
        const data: IFetchPosts = await res.json();

        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < MAX_POSTS) {
            setShowMore(false);
          }
        }
      } catch (error) {
        const err = error as IFetchError;
        console.log(err.message);
      }
    };

    if (currentUser?.isAdmin) {
      fetchPosts();
    }
  }, [currentUser?._id, currentUser?.isAdmin]);

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Дата обновления</Table.HeadCell>
              <Table.HeadCell>Картинка поста</Table.HeadCell>
              <Table.HeadCell>Заголовок поста</Table.HeadCell>
              <Table.HeadCell>Категория</Table.HeadCell>
              <Table.HeadCell>Удалить</Table.HeadCell>
              <Table.HeadCell>
                <span>Редактировать</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userPosts.map((post) => (
                <Table.Row
                  key={post.slug}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString("ru-RU")}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="text-red-500 font-medium hover:underline cursor-pointer"
                    >
                      Удалить
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline cursor-pointer"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Редактировать</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={onShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Показать еще
            </button>
          )}
        </>
      ) : (
        <p>Вы не написали еще ни одного поста</p>
      )}
      <PopupConfirm
        isOpen={showModal}
        setIsOpen={setShowModal}
        message="Вы действительно хотите удалить пост?"
        onConfirm={onDelete}
      />
    </div>
  );
};
