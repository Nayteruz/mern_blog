import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { FormEvent, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgress } from "@/shared/UI/CircularProgress";
import { useUploadImage } from "@/shared/hooks/useUploadImage";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/shared/const/routes";
import { TFormData } from "@/shared/types";
import useStore from "@/app/store/store.zustand";

export const UpdatePost = () => {
  const { postId } = useParams();
  const { currentUser } = useStore();
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<TFormData>({} as TFormData);
  const [publishError, setPublishError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { uploadProgress, uploadError, onUpload, uploadedFile } =
    useUploadImage({
      file,
      setFile,
    });

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();

        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
        } else {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error);
    }
  }, [postId]);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    const file = files[0] || null;

    setFile(file);
  };

  useEffect(() => {
    if (uploadedFile) {
      setFormData((prev) => ({ ...prev, image: uploadedFile }));
    }
  }, [uploadedFile]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (!formData._id) {
        setPublishError("Not corrected post id");
        return;
      }

      const res = await fetch(
        `/api/post/updatepost/${formData._id!}/${currentUser?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );
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
      <h1 className="text-center text-3xl my-7 font-semibold">
        Редактировать пост
      </h1>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Заголовок поста"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            value={formData?.title}
          />
          <Select
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
            value={formData?.category}
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
            setFormData((prev) => ({ ...prev, content: value }));
          }}
          value={formData?.content}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Отредактировать пост
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
