import { Logo } from "@/shared/UI/Logo";
import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

export const SignUp = () => {
  const formFields = [
    {
      label: "Ваше имя",
      type: "text",
      placeholder: "Имя",
      id: "username",
    },
    {
      label: "Ваш email",
      type: "email",
      placeholder: "name@company.com",
      id: "email",
    },
    {
      label: "Ваш пароль",
      type: "password",
      placeholder: "Пароль",
      id: "password",
    },
  ];

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Logo className="font-bold dark:text-white text-4xl" />
          <p className="text-sm mt-5">
            Это тестовый проект. Вы можете зарегистрироваться с помощью почты и
            пароля или с помощью google.
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            {formFields.map(({ label, type, placeholder, id }) => (
              <div key={id}>
                <Label value={label} />
                <TextInput type={type} placeholder={placeholder} id={id} />
              </div>
            ))}
            <Button gradientDuoTone="purpleToPink" type="submit">
              Зарегистрироваться
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>У вас уже есть аккаунт?</span>
            <Link to="/sign-in" className="text-blue-500">
              Войти
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
