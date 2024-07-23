import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Logo } from "@/shared/UI/Logo";
import { IFetchError, IUser } from "@/shared/types";
import { IFormData } from "./types";
import { formFields } from "./const";
import { ROUTES } from "@/shared/const/routes";
import OAuth from "@/shared/UI/OAuth";
import useStore from "@/app/store/store.zustand";

export const SignIn = () => {
  const {
    error: errorMessage,
    loading,
    setErrorLoading,
    setStartLoading,
    fetchSignInSuccess,
  } = useStore();
  const [formData, setFormData] = useState<IFormData>({});
  const navigate = useNavigate();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return setErrorLoading("All fields are required");
    }

    try {
      setStartLoading();
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        setErrorLoading(data.message);
      }

      if (res.ok) {
        fetchSignInSuccess(data as IUser);
        navigate(ROUTES.HOME);
      }
    } catch (error) {
      const err = error as IFetchError;
      setErrorLoading(err.message);
    }
  };

  return (
    <div className="mt-20 mb-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Logo className="font-bold dark:text-white text-4xl" />
          <p className="text-sm mt-5">
            Это тестовый проект. Вы можете авторизоваться с помощью почты и
            пароля или с помощью google.
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            {formFields.map(({ label, type, placeholder, id }) => (
              <div key={id}>
                <Label value={label} />
                <TextInput
                  type={type}
                  placeholder={placeholder}
                  id={id}
                  onChange={onChange}
                />
              </div>
            ))}
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Загрузка...</span>
                </>
              ) : (
                "Войти"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>У вас нет аккаунта?</span>
            <Link to={ROUTES.SIGN_UP} className="text-blue-500">
              Зарегистрируйтесь
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};
