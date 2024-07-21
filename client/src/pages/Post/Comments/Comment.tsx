import moment from "moment";
import { IComment, IUser } from "@/shared/types";
import { useEffect, useState } from "react";

moment.locale("ru");

interface ICommentProps {
  comment: IComment;
}

export const Comment = ({ comment }: ICommentProps) => {
  const [user, setUser] = useState<IUser | null>(null);

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
      </div>
    </div>
  );
};
