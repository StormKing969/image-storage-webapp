import React, {type JSX, useCallback, useEffect, useState} from "react";
import {
  getTotalPicturesCount,
  updatePictureDatabase,
  uploadPicture,
} from "../api/appwrite.ts";

/**
 * UploadPicture Component
 *
 * This component allows users to upload an image file and updates the total image count.
 *
 * Props:
 * @param {React.Dispatch<React.SetStateAction<number>>} setTotalImageNumber - A state setter function to update the total number of images.
 *
 * @returns {JSX.Element} A file input and label for uploading images.
 */
const UploadPicture = ({
  setTotalImageNumber,
}: {
  setTotalImageNumber: React.Dispatch<React.SetStateAction<number>>;
}): JSX.Element => {
  const [toUpload, setToUpload] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);

  /**
   * Handles file input changes and sets the selected image for upload.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The file input change event.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Check if files are selected and set the first file as the image
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setToUpload(true);
    }
  };

  /**
   * Uploads the selected image and updates the database.
   * Wrapped in useCallback to ensure stable reference in useEffect.
   */
  const handleUpload = useCallback(async () => {
    if (!image) {
      console.error("No image selected for upload.");
      return;
    }

    try {
      const imageId = await uploadPicture(image);

      if (!imageId) {
        console.error("Failed to upload image.");
        return;
      } else {
        await updatePictureDatabase(imageId, image.name, new Date());
        setTotalImageNumber((prev: number) => prev + 1);
        console.log("Image uploaded and database updated successfully.");
      }
    } catch (error) {
      console.error("Error uploading picture:", error);
    }
  }, [image, setTotalImageNumber]);

  /**
   * Effect to handle the upload process when an image is ready to be uploaded.
   * Dependencies: toUpload, image, handleUpload.
   */
  useEffect(() => {
    if (toUpload) {
      handleUpload()
        .then(() => setToUpload(false))
        .finally(() => setImage(null));
    }
  }, [toUpload, image, handleUpload]);

  /**
   * Effect to fetch the total number of pictures from the database on component mount.
   * Ensures safe state updates using an isMounted flag.
   */
  useEffect(() => {
    let isMounted = true;

    getTotalPicturesCount()
      .then((total) => {
        console.log("Total images count fetched:", total);
        if (isMounted) {
          setTotalImageNumber(total);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      {/* Hidden file input for selecting an image */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        id={"inputFile"}
        name={"inputFile"}
        className={"hidden"}
      />

      {/* Label styled as a button for triggering the file input */}
      <label
        htmlFor="inputFile"
        className={
          "bg-blue-500 text-center cursor-pointer rounded-sm text-xl p-1"
        }
      >
        Upload Image
      </label>
    </div>
  );
};

export default UploadPicture;