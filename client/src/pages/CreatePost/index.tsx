import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { FormEvent, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgress } from "@/shared/UI/CircularProgress";
import { useUploadImage } from "@/shared/hooks/useUploadImage";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/const/routes";

type TFormData = {
  title: string;
  content: string;
  category: string;
  image: string;
};

export const CreatePost = () => {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<TFormData>({} as TFormData);
  const [publishError, setPublishError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { uploadProgress, uploadError, onUpload, uploadedFile } =
    useUploadImage({
      file,
      setFile,
    });

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    const file = files[0];

    if (file) {
      setFile(file);
    } else {
      setFile(null);
    }
  };

  useEffect(() => {
    if (uploadedFile) {
      setFormData((prev) => ({ ...prev, image: uploadedFile }));
    }
  }, [uploadedFile]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        setPublishError(data.message);
        return;
      }

      setPublishError(null);
      navigate(`${ROUTES.POST}/${data.slug}`);
    } catch (error) {
      setPublishError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto w-full">
      <h1 className="text-center text-3xl my-7 font-semibold">Создать пост</h1>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Заголовок поста"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
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

        {publishError && (
          <Alert color="failure" className="mt-5">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
};
