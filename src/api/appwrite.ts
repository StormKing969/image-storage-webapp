import { Client, Databases, ID, Query, Storage } from "appwrite";

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT);
const database = new Databases(client);
const storage = new Storage(client);

/**
 * Fetches the total number of pictures in the database.
 *
 * @returns {Promise<number>} The total count of pictures, or 0 if an error occurs.
 */
export const getTotalPicturesCount = async (): Promise<number> => {
  try {
    const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID);
    return response.total;
  } catch (error) {
    console.error("Error fetching total pictures count:", error);
    return 0;
  }
};

/**
 * Fetches pictures from the database based on a search query.
 *
 * @param {string} query - The search query to filter pictures by name.
 *
 * @returns {Promise<Array<{documentId: string, imageId: string, imageName: string, createdAt: string, imageUrl: string}>> | undefined}
 *          An array of picture objects, or undefined if an error occurs.
 */
export const fetchPictures = async (
  query: string,
): Promise<
  | {
      documentId: string;
      imageId: string;
      imageName: string;
      createdAt: Date;
      imageUrl: string;
    }[]
  | undefined
> => {
  try {
    console.log("Fetching pictures with query:", query);
    const response = query
      ? await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
          Query.startsWith("imageName", query),
        ])
      : await database.listDocuments(DATABASE_ID, COLLECTION_ID);

    return response.documents.map((doc) => ({
      documentId: doc.$id,
      imageId: doc.imageId,
      imageName: doc.imageName,
      createdAt: doc.createdAt,
      imageUrl: doc.imageUrl,
    }));
  } catch (error) {
    console.error("Error fetching all pictures:", error);
  }
};

/**
 * Uploads a picture file to the storage bucket.
 *
 * @param {File} file - The image file to upload.
 *
 * @returns {Promise<string | null>} The unique ID of the uploaded file, or null if an error occurs.
 */
export const uploadPicture = async (file: File): Promise<string | null> => {
  try {
    const checkStorage = await storage.listFiles(BUCKET_ID, [
      Query.equal("name", file.name),
    ]);
    if (checkStorage.total > 0) {
      console.error("File with the same name already exists in storage.");
      return null;
    }

    const response = await storage.createFile(BUCKET_ID, "unique()", file);

    return response.$id;
  } catch (error) {
    console.error("Error uploading picture:", error);
    return null;
  }
};

/**
 * Updates the database with information about a newly uploaded picture.
 *
 * @param {string} imageId - The unique ID of the uploaded image.
 * @param {string} imageName - The name of the image.
 * @param {Date} createdAt - The creation date of the image.
 *
 * @returns {Promise<void>} Resolves when the database is successfully updated.
 */
export const updatePictureDatabase = async (
  imageId: string,
  imageName: string,
  createdAt: Date,
): Promise<void> => {
  try {
    if (
      imageId == null ||
      imageName == null ||
      createdAt == null ||
      createdAt.getTime() > Date.now()
    ) {
      console.error("Invalid parameters for updating picture database.");
      return;
    }

    const getImageUrl = storage.getFileView(BUCKET_ID, imageId);

    await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
      imageId: imageId,
      imageName: imageName,
      createdAt: createdAt.toISOString(),
      imageUrl: getImageUrl,
    });

    console.log("Picture database updated successfully.");
  } catch (error) {
    console.error("Error updating picture database:", error);
    return;
  }
};

/**
 * Deletes a picture from the database and storage bucket.
 *
 * @param {string} imageId - The unique ID of the image in the storage bucket.
 * @param {string} documentId - The document ID of the image in the database.
 *
 * @returns {Promise<void>} Resolves when the picture is successfully deleted.
 */
export const deletePicture = async (
  imageId: string,
  documentId: string,
): Promise<void> => {
  try {
    if (!imageId || !documentId) {
      console.error("Image ID is required to delete a picture.");
      return;
    }

    await database.deleteDocument(DATABASE_ID, COLLECTION_ID, documentId);
    await storage.deleteFile(BUCKET_ID, imageId);
  } catch (error) {
    console.error("Error deleting picture:", error);
  }
};