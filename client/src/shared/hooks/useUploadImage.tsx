import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "@/app/firebase";
import { Dispatch, SetStateAction, useState } from "react";

interface IUploadImageProps {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
}

export const useUploadImage = ({ file, setFile }: IUploadImageProps) => {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

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
          setUploadedFile(null);
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
            setUploadedFile(downloadURL);
          });
        },
      );
    } catch (error) {
      setUploadError("Image uploading failed");
      setUploadProgress(null);
      console.log(error);
    }
  };

  return {
    uploadProgress,
    uploadError,
    uploadedFile,
    onUpload,
  };
};
