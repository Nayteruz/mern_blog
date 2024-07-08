import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Logo } from "@/shared/UI/Logo";
import { IErrorServerData } from "@/shared/types";
import { IFormData } from "./types";
import { formFields } from "./const";
import { ROUTES } from "@/shared/const/routes";

export const SignUp = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>({});
  const navigate = useNavigate();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("All fields are required");
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }

      setLoading(false);

      if (res.ok) {
        navigate(ROUTES.SIGN_IN);
      }
    } catch (error) {
      const err = error as IErrorServerData;
      setErrorMessage(err?.message);
      setLoading(false);
    }
  };

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
                "Зарегистрироваться"
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>У вас уже есть аккаунт?</span>
            <Link to="/sign-in" className="text-blue-500">
              Войти
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
