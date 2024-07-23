import { ICurrentUser } from "@/app/store/slice/user/userSlice";
import useStore from "@/app/store/store.zustand";
import { IFetchError, IFetchUsers } from "@/shared/types";
import { PopupConfirm } from "@/shared/UI/PopupConfirm";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

const MAX_USERS = 9;

export const DashUsers = () => {
  const { currentUser } = useStore();
  const [users, setUsers] = useState<ICurrentUser[]>([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  const onShowMore = async () => {
    const startIndex = users.length;

    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data: IFetchUsers = await res.json();

      if (res.ok) {
        setUsers((prevUsers) => [...prevUsers, ...data.users]);
        if (data.users.length < MAX_USERS) {
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
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userIdToDelete),
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
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers?limit=${MAX_USERS}`);
        const data: IFetchUsers = await res.json();

        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < MAX_USERS) {
            setShowMore(false);
          }
        }
      } catch (error) {
        const err = error as IFetchError;
        console.log(err.message);
      }
    };

    if (currentUser?.isAdmin) {
      fetchUsers();
    }
  }, [currentUser?._id, currentUser?.isAdmin]);

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Дата создания</Table.HeadCell>
              <Table.HeadCell>Аватар</Table.HeadCell>
              <Table.HeadCell>Имя</Table.HeadCell>
              <Table.HeadCell>Почта</Table.HeadCell>
              <Table.HeadCell>Админ</Table.HeadCell>
              <Table.HeadCell>Удалить</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users.map((user) => (
                <Table.Row
                  key={user._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
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
        <p>Нет ни одного пользователя</p>
      )}
      <PopupConfirm
        isOpen={showModal}
        setIsOpen={setShowModal}
        message="Вы действительно хотите удалить пользователя?"
        onConfirm={onDelete}
      />
    </div>
  );
};
