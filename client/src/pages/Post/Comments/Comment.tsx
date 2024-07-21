import moment from "moment";
import { IComment, IUser } from "@/shared/types";
import { memo, useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { plural } from "@/shared/const/plural";

interface ICommentProps {
  comment: IComment;
  onLike: (commentId: string) => void;
  userCurrent: IUser | null;
}

export const Comment = memo(
  ({ comment, onLike, userCurrent }: ICommentProps) => {
    const [user, setUser] = useState<IUser | null>(null);
    const likeForm = ["лайк", "лайка", "лайков"];
    const likePlural = `${comment.numberOfLikes} ${plural(likeForm, comment.numberOfLikes)}`;
    const isUserLike =
      userCurrent && comment.likes.indexOf(userCurrent?._id) > -1;

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

    return (
      <div className="flex p-4 border-b dark:border-gray-600 text-sm">
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
          <p className="text-gray-500 pb-2">{comment.content}</p>
          <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
            <button
              className={`text-gray-400 hover:text-blue-500 ${isUserLike ? "!text-blue-500" : ""}`}
              onClick={() => onLike(comment._id)}
            >
              <FaThumbsUp className="text-sm" />
            </button>
            <p>{comment.numberOfLikes > 0 && likePlural}</p>
          </div>
        </div>
      </div>
    );
  },
);
