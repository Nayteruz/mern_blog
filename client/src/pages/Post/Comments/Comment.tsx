import moment from "moment";
import { IComment, IFetchError, IUser } from "@/shared/types";
import { memo, useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { plural } from "@/shared/const/plural";
import { Button, Spinner, Textarea } from "flowbite-react";

interface ICommentProps {
  comment: IComment;
  onLike: (commentId: string) => void;
  onEdit: (commentId: string, editedContent: string) => void;
  onDelete: (commentId: string) => void;
  userCurrent: IUser | null;
  isLoading: boolean;
  likeCommentId: string;
}

export const Comment = memo(
  ({
    comment,
    onLike,
    userCurrent,
    onEdit,
    onDelete,
    isLoading,
    likeCommentId,
  }: ICommentProps) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState("");
    const likeForm = ["лайк", "лайка", "лайков"];
    const likePlural = `${comment.numberOfLikes} ${plural(likeForm, comment.numberOfLikes)}`;
    const isUserLike =
      userCurrent && comment.likes.indexOf(userCurrent?._id) > -1;
    const isLikeLoading = likeCommentId === comment._id;

    useEffect(() => {
      const getUser = async () => {
        try {
          const res = await fetch(`/api/user/${comment.userId}`);
          const data = await res.json();

          if (res.ok) {
            setUser(data);
          }
        } catch (error) {
          console.log(error);
        }
      };

      getUser();
    }, [comment]);

    const onToggleEdit = () => {
      setIsEditing(true);
      setEditedContent(comment.content);
    };

    const handleSave = async () => {
      try {
        const res = await fetch(`/api/comment/editComment/${comment._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: editedContent,
          }),
        });

        if (res.ok) {
          setIsEditing(false);
          onEdit(comment._id, editedContent);
        }
      } catch (error) {
        const err = error as IFetchError;
        console.log(err.message);
      }
    };

    return (
      <div className="flex p-4 border-b dark:border-gray-600 text-sm relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Spinner size="xl" />
          </div>
        )}
        <div className="flex-shrink-0 mr-3">
          <img
            src={user?.profilePicture}
            alt={user?.username}
            className="w-10 h-10 rounded-full bg-gray-200 object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-1 gap-1">
            <span className="font-bold mr-1 text-xs truncate">
              {user ? `@${user?.username}` : "анонимный пользователь"}
            </span>
            <span className="text-gray-500 text-xs">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>
          {isEditing ? (
            <>
              <Textarea
                className="resize-none mb-2"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className="flex items-center justify-end gap-2 text-xs">
                <Button
                  type="button"
                  size="sm"
                  gradientDuoTone="purpleToBlue"
                  outline
                  onClick={handleSave}
                >
                  Сохранить
                </Button>
                <Button
                  type="button"
                  size="sm"
                  gradientDuoTone="purpleToBlue"
                  outline
                  onClick={() => setIsEditing(false)}
                >
                  Отменить
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-500 pb-2">{comment.content}</p>
              <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
                <button
                  className={`text-gray-400 hover:text-blue-500 ${isUserLike ? "!text-blue-500" : ""}`}
                  onClick={() => onLike(comment._id)}
                  disabled={isLikeLoading}
                >
                  {isLikeLoading ? (
                    <Spinner size="xs" />
                  ) : (
                    <FaThumbsUp className="text-sm" />
                  )}
                </button>
                <p>{comment.numberOfLikes > 0 && likePlural}</p>
                {userCurrent &&
                  (userCurrent._id === comment.userId ||
                    userCurrent.isAdmin) && (
                    <>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-blue-500"
                        onClick={onToggleEdit}
                      >
                        Редактировать
                      </button>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => onDelete(comment._id)}
                      >
                        Удалить
                      </button>
                    </>
                  )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  },
);
