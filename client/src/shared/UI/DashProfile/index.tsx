import { Button, TextInput, Alert } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "@/app/firebase";
import { useAppSelector } from "@/app/store/hooks";
import { CircularProgress } from "../CircularProgress";

export const DashProfile = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState<
    number | null
  >(null);
  const [imageFileUploadError, setImageFileUploadError] = useState<string>("");
  const filePickerRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    if (!imageFile) {
      return;
    }

    setImageFileUploadError("");
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(Number(progress.toFixed(0)));
      },
      () => {
        const errString = "Could not upload image (File must be less than 2MB)";
        setImageFileUploadError(errString);
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setImageFileUploadProgress(null);
        });
      },
    );
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Профиль</h1>
      <form className="flex flex-col gap-4">
        <input
          ref={filePickerRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <div
          className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full relative"
          onClick={() => filePickerRef.current?.click()}
        >
          <img
            src={imageFileUrl || currentUser?.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 ? "opacity-30" : ""}`}
          />
          {imageFileUploadProgress && (
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]">
              <CircularProgress
                value={imageFileUploadProgress}
                text={`${imageFileUploadProgress}%`}
                styles={{
                  root: {
                    position: "absolute",
                    inset: "0",
                    width: "100%",
                    height: "100%",
                  },
                  path: {
                    stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
                  },
                }}
              />
            </div>
          )}
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
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
