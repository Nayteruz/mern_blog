import { useAppSelector } from "@/app/store/hooks";
import { IComment, IFetchComments, IFetchError } from "@/shared/types";
import { PopupConfirm } from "@/shared/UI/PopupConfirm";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";

const MAX_COMMENTS = 9;

export const DashComments = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  const [comments, setComments] = useState<IComment[]>([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  const onShowMore = async () => {
    const startIndex = comments.length;

    try {
      const res = await fetch(
        `/api/comment/getComments?startIndex=${startIndex}`,
      );
      const data: IComment[] = await res.json();

      if (res.ok) {
        setComments((prevComments) => [...prevComments, ...data]);
        if (data.length < MAX_COMMENTS) {
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
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (res.ok) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentIdToDelete),
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
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `/api/comment/getComments?limit=${MAX_COMMENTS}`,
        );
        const data: IFetchComments = await res.json();

        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < MAX_COMMENTS) {
            setShowMore(false);
          }
        }
      } catch (error) {
        const err = error as IFetchError;
        console.log(err.message);
      }
    };

    if (currentUser?.isAdmin) {
      fetchComments();
    }
  }, [currentUser?._id, currentUser?.isAdmin]);

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Дата обновления</Table.HeadCell>
              <Table.HeadCell>Текст комментария</Table.HeadCell>
              <Table.HeadCell>Количество лайков</Table.HeadCell>
              <Table.HeadCell>ID поста</Table.HeadCell>
              <Table.HeadCell>ID пользователя</Table.HeadCell>
              <Table.HeadCell>Удалить</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {comments.map((comment) => (
                <Table.Row
                  key={comment._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString("ru-RU")}
                  </Table.Cell>
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className="text-red-500 font-medium hover:underline cursor-pointer"
                    >
                      Удалить
                    </span>
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
        <p>Нет ни одного комментария</p>
      )}
      <PopupConfirm
        isOpen={showModal}
        setIsOpen={setShowModal}
        message="Вы действительно хотите удалить комментарий?"
        onConfirm={onDelete}
      />
    </div>
  );
};
