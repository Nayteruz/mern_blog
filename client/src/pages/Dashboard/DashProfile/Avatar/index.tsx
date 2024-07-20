import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Alert } from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "@/app/firebase";
import { IFormData } from "@/shared/types";
import { CircularProgress } from "@/shared/UI/CircularProgress";

interface IAvatarProps {
  imageUrl: string;
  isUploading: boolean;
  setIsUploading: Dispatch<SetStateAction<boolean>>;
  setFormData: Dispatch<SetStateAction<IFormData>>;
}

export const Avatar = ({
  imageUrl,
  isUploading,
  setIsUploading,
  setFormData,
}: IAvatarProps) => {
  const filePickerRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] =
    useState<number>(0);
  const [imageFileUploadError, setImageFileUploadError] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = useCallback(async () => {
    if (!imageFile) {
      return;
    }

    console.log("upload image");

    setImageFileUploadError("");
    setIsUploading(true);
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
        setIsUploading(false);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setIsUploading(false);
          setFormData((prev) => ({ ...prev, profilePicture: downloadUrl }));
        });
      },
    );
  }, [imageFile, setFormData, setIsUploading]);

  useEffect(() => {
    uploadImage();
  }, [imageFile, uploadImage]);

  return (
    <>
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
          src={imageFileUrl || imageUrl}
          alt="user"
          className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${isUploading && imageFileUploadProgress < 100 ? "opacity-30" : ""}`}
        />
        {isUploading && (
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
    </>
  );
};
