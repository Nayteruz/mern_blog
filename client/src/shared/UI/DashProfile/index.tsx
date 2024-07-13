import { useAppSelector } from "@/app/store/hooks";
import { Button, TextInput } from "flowbite-react";

export const DashProfile = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Профиль</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src={currentUser?.profilePicture}
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="Имя"
          defaultValue={currentUser?.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Почта"
          defaultValue={currentUser?.email}
        />
        <TextInput type="password" id="password" placeholder="Пароль" />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Обновить данные
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Удалить аккаунт</span>
        <span className="cursor-pointer">Выйти</span>
      </div>
    </div>
  );
};
