import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const CreatePost = () => {
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
          <FileInput accept="image/*" />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
          >
            Загрузить фото
          </Button>
        </div>
        <ReactQuill
          theme="snow"
          placeholder="Текст поста"
          className="h-72 mb-12"
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Опубликовать
        </Button>
      </form>
    </div>
  );
};
