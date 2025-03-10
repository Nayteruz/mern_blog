import { Button, TextInput, Alert } from "flowbite-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { IFetchError, IFormData } from "@/shared/types";
import { Avatar } from "./Avatar";
import { DeleteButton } from "./DeleteButton";
import { SignOut } from "./SignOut";
import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/const/routes";
import useStore from "@/app/store/store.zustand";

export const DashProfile = () => {
  const {
    error: userSliceError,
    loading,
    currentUser,
    setErrorLoading,
    setStartLoading,
    fetchUpdateUserSuccess,
  } = useStore();
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>({});
  const [userUpdateSuccess, setUserUpdateSuccess] = useState<string | null>(
    null,
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStartLoading();
    setUserUpdateSuccess("");

    if (Object.keys(formData).length === 0) {
      setErrorLoading("Нет заполненных полей");
      return;
    }

    if (isImageUploading) {
      setErrorLoading("Дождитесь загрузки картинки");
      return;
    }

    try {
      const res = await fetch(`/api/user/update/${currentUser?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        fetchUpdateUserSuccess(data);
        setUserUpdateSuccess("Профиль успешно обновлен");
      } else {
        setErrorLoading(data.message);
      }
    } catch (error) {
      const err = error as IFetchError;
      setErrorLoading(err.message);
    } finally {
      setFormData({});
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Профиль</h1>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <Avatar
          imageUrl={currentUser?.profilePicture || ""}
          isUploading={isImageUploading}
          setIsUploading={setIsImageUploading}
          setFormData={setFormData}
        />
        <TextInput
          type="text"
          id="username"
          placeholder="Имя"
          defaultValue={currentUser?.username || ""}
          onChange={onChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Почта"
          defaultValue={currentUser?.email || ""}
          onChange={onChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Пароль"
          onChange={onChange}
        />
        <Button
          type="submit"
          disabled={loading || isImageUploading}
          gradientDuoTone="purpleToBlue"
          outline
        >
          {loading ? "Обновление..." : "Обновить данные"}
        </Button>
        {currentUser?.isAdmin && (
          <Link to={ROUTES.CREATE_POST}>
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Создать пост
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <DeleteButton user={currentUser} />
        <SignOut />
      </div>
      {userUpdateSuccess && (
        <Alert color="success" className="mt-5">
          {userUpdateSuccess}
        </Alert>
      )}
      {userSliceError && (
        <Alert color="failure" className="mt-5">
          {userSliceError}
        </Alert>
      )}
    </div>
  );
};
