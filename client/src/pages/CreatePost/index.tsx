import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "@/app/firebase";
import { CircularProgress } from "@/shared/UI/CircularProgress";

type TFormData = {
  title: string;
  content: string;
  category: string;
  image: string;
};

export const CreatePost = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TFormData>({} as TFormData);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    const file = files[0];

    if (file) {
      setFile(file);
    } else {
      setFile(null);
    }
  };

  const onUpload = async () => {
    try {
      if (!file) {
        setUploadError("Please select a image");
        return;
      }

      setUploadError(null);
      const storage = getStorage(app);
      const filename = new Date().getTime() + file.name;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Number(progress.toFixed(0)));
        },
        () => {
          setUploadError("Image uploading failed");
          setUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploadProgress(null);
            setUploadError(null);
            setFile(null);
            setFormData((prev) => ({ ...prev, image: downloadURL }));
          });
        },
      );
    } catch (error) {
      setUploadError("Image uploading failed");
      setUploadProgress(null);
      console.log(error);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto w-full">
      <h1 className="text-center text-3xl my-7 font-semibold">Создать пост</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Заголовок поста"
            required
            id="title"
            className="flex-1"
          />
          <Select>
            <option value="unvategorized">Выбрать категорию</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput accept="image/*" onChange={onChangeFile} />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={onUpload}
            disabled={uploadProgress !== null}
          >
            {uploadProgress !== null ? (
              <div className="w-16 h-16">
                <CircularProgress
                  value={uploadProgress}
                  text={`${uploadProgress}%`}
                />
              </div>
            ) : (
              "Загрузить фото"
            )}
          </Button>
        </div>
        {uploadError && <Alert color="failure">{uploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="Uploaded image"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Текст поста"
          className="h-72 mb-12"
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Опубликовать
        </Button>
      </form>
    </div>
  );
};
