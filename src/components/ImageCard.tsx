import React, { type JSX } from "react";
 import { deletePicture } from "../api/appwrite.ts";

 /**
  * ImageCard Component
  *
  * This component represents a card that displays an image along with its name and creation date.
  *
  * Props:
  * @param {string} id - The unique identifier of the image.
  * @param {string} name - The name of the image to be displayed.
  * @param {string} imageUrl - The URL of the image to be displayed.
  * @param {Date} creationDate - The creation date of the image.
  * @param {string} documentId - The document ID associated with the image in the database.
  * @param {React.Dispatch<React.SetStateAction<boolean>>} setRefreshFetch - A state setter function to trigger a refresh of the image list.
  *
  * @returns {JSX.Element} A styled card containing the image, name, and formatted creation date, with a delete button.
  */
 const ImageCard = ({
   id,
   name,
   imageUrl,
   creationDate,
   documentId,
   setRefreshFetch,
 }: {
   id: string;
   name: string;
   imageUrl: string;
   creationDate: Date;
   documentId: string;
   setRefreshFetch: React.Dispatch<React.SetStateAction<boolean>>;
 }): JSX.Element => {
   /**
    * Handles the deletion of the image.
    */
   const handleDelete = async () => {
     try {
       await deletePicture(id, documentId);
       console.log("Image deleted successfully.");
       setRefreshFetch((prev) => !prev);
     } catch (error) {
       console.error("Error deleting image:", error);
     }
   };

   return (
     <div
       className={
         "bg-blue-950 p-5 rounded-2xl shadow-inner shadow-light-100/10 cursor-pointer"
       }
     >
       {/* Image element displaying the image */}
       <img
         src={imageUrl}
         alt={name}
         className={"rounded-lg w-full h-[250px] object-cover object-center"}
       />

       {/* Container for the image name and creation date */}
       <div className={"mt-4 text-left"}>
         <h3 className={"text-white font-bold"}>{name}</h3>

         <div className={"flex flex-row justify-between items-center mt-2"}>
           <p className={"text-gray-400 text-sm"}>
             {new Date(creationDate).toLocaleDateString("en-US", {
               year: "numeric",
               month: "long",
               day: "numeric",
             })}
           </p>

           {/* Button to delete the image */}
           <button onClick={handleDelete} className={"cursor-pointer"}>
             Delete
           </button>
         </div>
       </div>
     </div>
   );
 };

 export default ImageCard;