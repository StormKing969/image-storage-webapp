import { type JSX, useEffect, useState } from "react";
import SearchBar from "./SearchBar.tsx";
import UploadPicture from "./UploadPicture.tsx";
import { fetchPictures } from "../api/appwrite.ts";
import type { Image } from "../interface/Image.ts";
import ImageCard from "./ImageCard.tsx";

/**
 * Home Component
 *
 * This component serves as the main page for displaying and managing images.
 *
 * State Variables:
 * @property {number} totalImageNumber - The total number of images available.
 * @property {string} searchImage - The current search term entered by the user.
 * @property {string} debouncedSearchTerm - The debounced search term for optimized API calls.
 * @property {boolean} loading - Indicates whether the image fetching process is ongoing.
 * @property {boolean} refreshFetch - A flag to trigger re-fetching of images.
 * @property {Image[]} imageList - The list of images fetched from the database.
 *
 * Functions:
 * @function getAllImages - Fetches images based on the search term and updates the image list.
 * @param {string} searchTerm - The search term used to filter images.
 *
 * Effects:
 * @effect Debounces the search term to optimize API calls.
 * @effect Fetches images whenever the debounced search term, total image number, or refresh flag changes.
 *
 * @returns {JSX.Element} The main layout containing the search bar, upload button, and image grid.
 */
const Home = (): JSX.Element => {
  const [totalImageNumber, setTotalImageNumber] = useState<number>(0);
  const [searchImage, setSearchImage] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshFetch, setRefreshFetch] = useState<boolean>(false);
  const [imageList, setImageList] = useState<Image[]>([]);

  /**
   * Fetches all images based on the search term.
   * Updates the image list and handles errors.
   * @param {string} searchTerm - The search term used to filter images.
   */
  const getAllImages = async (searchTerm: string) => {
    setLoading(true);

    try {
      const response = await fetchPictures(searchTerm);

      // If the response is empty or undefined, log an error and set imageList to an empty array
      if (!response || response.length === 0) {
        console.error("No images found");
        setImageList([]);
        return;
      }

      setImageList(response || []);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  /**
   * Effect to debounce the search term for optimized API calls.
   * Updates the debounced search term after a delay.
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchImage);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchImage]);

  /**
   * Effect to fetch images whenever the debounced search term, total image number, or refresh flag changes.
   */
  useEffect(() => {
    getAllImages(debouncedSearchTerm).then(() => setLoading(false));
  }, [debouncedSearchTerm, totalImageNumber, refreshFetch]);

  return (
    <main
      className={"px-3 py-12 max-w-7xl mx-auto flex flex-col relative z-10"}
    >
      <header
        className={
          "flex flex-row sm:flex-col justify-between w-full h-full items-center"
        }
      >
        <SearchBar searchImage={searchImage} setSearchImage={setSearchImage} />
        <UploadPicture setTotalImageNumber={setTotalImageNumber} />
      </header>

      <section className={"space-y-5"}>
        {/* Display the total number of images */}
        <h1 className={"mt-10 text-2xl"}>{totalImageNumber} images</h1>

        <div>
          {loading ? (
            // Show loading message while fetching images
            <h1 className={"text-2xl font-bold text-center justify-center"}>
              Loading...
            </h1>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {imageList.length > 0 ? (
                // Render image cards for each image in the list
                imageList.map((image) => (
                  <ImageCard
                    key={image.imageId}
                    documentId={image.documentId}
                    id={image.imageId}
                    name={image.imageName}
                    imageUrl={image.imageUrl}
                    creationDate={image.createdAt}
                    setRefreshFetch={setRefreshFetch}
                  />
                ))
              ) : (
                // Show placeholder image if no images are found
                <img
                  src={"./no-image.png"}
                  alt={"No images found"}
                  className={
                    "rounded-lg w-full h-[250px] object-cover object-center"
                  }
                />
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;