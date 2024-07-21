import { useAppSelector } from "@/app/store/hooks";
import { ROUTES } from "@/shared/const/routes";
import { IComment, IFetchError } from "@/shared/types";
import { Alert, Button, Spinner, Textarea } from "flowbite-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Comment } from "./Comment";
import { PopupConfirm } from "@/shared/UI/PopupConfirm";

interface ICommentsProps {
  postId: string;
}

const MAX_CHARACTERS = 200;

export const Comments = ({ postId }: ICommentsProps) => {
  const { currentUser } = useAppSelector((state) => state.user);
  const [comment, setComment] = useState<string>("");
  const [deleteCommentId, setDeleteCommentId] = useState<string>("");
  const [commentError, setCommentError] = useState("");
  const [comments, setComments] = useState<IComment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [likeCommentId, setLikeCommentId] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (comment.length > MAX_CHARACTERS) {
      return;
    }

    setIsSendingComment(true);

    try {
      const res = await fetch(`/api/comment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser?._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setComment("");
        setCommentError("");
        setComments((prevComments) => [data, ...prevComments]);
        setIsSendingComment(false);
      }
    } catch (error) {
      const err = error as IFetchError;
      setCommentError(err.message);
      setIsSendingComment(false);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        const data = await res.json();

        if (res.ok) {
          setComments(data);
        }
      } catch (error) {
        const err = error as IFetchError;
        console.log(err.message);
      }
    };

    fetchComments();
  }, [postId]);

  const onLike = useCallback(
    async (commentId: string) => {
      try {
        if (!currentUser) {
          navigate(ROUTES.SIGN_IN);
          return;
        }

        setLikeCommentId(commentId);
        const res = await fetch(`/api/comment/likeComment/${commentId}`, {
          method: "PUT",
        });

        if (res.ok) {
          const data = await res.json();
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment._id === commentId
                ? {
                    ...comment,
                    likes: data.likes,
                    numberOfLikes: data.likes.length,
                  }
                : comment,
            ),
          );
        }
        setLikeCommentId("");
      } catch (error) {
        const err = error as IFetchError;
        console.log(err.message);
        setLikeCommentId("");
      }
    },
    [currentUser, navigate],
  );

  const onEdit = (commentId: string, editedContent: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === commentId
          ? {
              ...comment,
              content: editedContent,
            }
          : comment,
      ),
    );
  };

  const onDelete = async () => {
    if (!currentUser) {
      navigate(ROUTES.SIGN_IN);
      return;
    }

    setIsDeleting(true);
    setShowModal(false);

    try {
      const res = await fetch(`/api/comment/deleteComment/${deleteCommentId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
        return;
      }

      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== deleteCommentId),
      );

      setDeleteCommentId("");
      setIsDeleting(false);
    } catch (error) {
      const err = error as IFetchError;
      console.log(err.message);
      setIsDeleting(false);
    }
  };

  const showModalPopup = (commentId: string) => {
    setShowModal(true);
    setDeleteCommentId(commentId);
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Авторизован как:</p>
          {currentUser.profilePicture && (
            <img
              src={currentUser.profilePicture}
              alt={currentUser?.username}
              className="h-5 w-5 object-cover rounded-full"
            />
          )}
          <Link
            to={`${ROUTES.DASHBOARD}?tab=profile`}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          Что бы оставлять комментарии необходимо{" "}
          <Link
            to={ROUTES.SIGN_IN}
            className="text-blue-900 underline hover:no-underline"
          >
            авторизоваться
          </Link>
        </div>
      )}
      {currentUser && (
        <>
          <form
            onSubmit={onSubmit}
            className="border border-teal-500 rounded-md p-3"
          >
            <Textarea
              placeholder="Добавить комментарий"
              rows={3}
              maxLength={MAX_CHARACTERS}
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <div className="flex justify-between items-center mt-5">
              <p className="text-gray-500 text-xs">
                Осталось символов: {MAX_CHARACTERS - comment.length}
              </p>
              <Button
                disabled={isSendingComment || comment.length > MAX_CHARACTERS}
                outline
                gradientDuoTone="purpleToBlue"
                type="submit"
              >
                {isSendingComment ? (
                  <span className="flex items-center gap-1">
                    <Spinner size="sm" />
                    Отправка ...
                  </span>
                ) : (
                  "Отправить"
                )}
              </Button>
            </div>
            {commentError && (
              <Alert color="failure" className="mt-5">
                {commentError}
              </Alert>
            )}
          </form>
        </>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">Нет комментариев</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Комментарии</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              userCurrent={currentUser}
              comment={comment}
              onLike={onLike}
              onEdit={onEdit}
              onDelete={showModalPopup}
              isLoading={deleteCommentId === comment._id && isDeleting}
              likeCommentId={likeCommentId}
            />
          ))}
        </>
      )}
      <PopupConfirm
        isOpen={showModal}
        setIsOpen={setShowModal}
        message="Вы уверены, что хотите удалить комментарий?"
        onConfirm={onDelete}
        ok="Да, я уверен"
        cancel="Нет, передумал"
      />
    </div>
  );
};
