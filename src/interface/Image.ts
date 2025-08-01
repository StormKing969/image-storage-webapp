/**
 * Image Interface
 *
 * Represents the structure of an image object used in the application.
 *
 * Properties:
 * @property {string} imageName - The name of the image.
 * @property {Date} createdAt - The date when the image was created.
 * @property {string} imageId - The unique identifier for the image.
 * @property {string} imageUrl - The URL of the image.
 * @property {string} documentId - The unique identifier for the document image.
 */
export interface Image {
  imageName: string;
  createdAt: Date;
  imageId: string;
  imageUrl: string;
  documentId: string;
}