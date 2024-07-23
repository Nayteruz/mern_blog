import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "@/app/firebase";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/const/routes";
import useStore from "@/app/store/store.zustand";

const OAuth = () => {
  const { fetchSignInSuccess } = useStore();
  const auth = getAuth(app);
  const navigate = useNavigate();
  const handleGoogleCLick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        fetchSignInSuccess(data);
        navigate(ROUTES.HOME);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      className="flex items-center justify-center"
      onClick={handleGoogleCLick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      <span className="self-center">Продолжить с Google</span>
    </Button>
  );
};

export default OAuth;
