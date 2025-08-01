import React, { type JSX } from "react";

 /**
  * SearchBar Component
  *
  * This component provides a search input field for filtering images.
  *
  * Props:
  * @param {string} searchImage - The current search term entered by the user.
  * @param {React.Dispatch<React.SetStateAction<string>>} setSearchImage - A state setter function to update the search term.
  *
  * @returns {JSX.Element} A styled search bar with an input field and a search icon.
  */
 const SearchBar = ({
   searchImage,
   setSearchImage,
 }: {
   searchImage: string;
   setSearchImage: React.Dispatch<React.SetStateAction<string>>;
 }): JSX.Element => {
   return (
     <div
       className={"relative flex items-center bg-gray-500 rounded-sm min-w-md"}
     >
       {/* Search icon displayed on the left side of the input field */}
       <img
         src="./search.svg"
         alt="Search icon"
         className={"absolute left-2 h-5 w-5"}
       />

       {/* Input field for entering the search term */}
       <input
         className={
           "w-full bg-transparent py-2 pl-10 text-base text-gray-200 placeholder-light-200 outline-hidden"
         }
         type="text"
         placeholder="Search Images..."
         value={searchImage}
         onChange={(e) => setSearchImage(e.target.value)}
       />
     </div>
   );
 };

 export default SearchBar;