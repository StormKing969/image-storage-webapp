# Image Storage & Management Web App

A modern, responsive web application for storing, viewing, and managing images. Built with React, TypeScript, Vite, and 
Tailwind CSS, and powered by Appwrite for secure image storage. It took about 7 ~ 8 hours to develop this application, focusing on simplicity and user experience.

## 🚀 Features

- Upload images with ease
- View images in a responsive gallery
- Delete unwanted images
- Mobile-friendly design

## 🛠️ Technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- Appwrite (cloud storage & backend)

## 📦 Getting Started

### Prerequisites

- Node.js v16+
- npm

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/StormKing969/image-storage-webapp.git
cd image-storage-webapp
npm install
```

### Configuration

Create a `.env` file in the root directory and add your Appwrite project credentials:

```env
VITE_APPWRITE_ENDPOINT=https://your-appwrite-endpoint
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_BUCKET_ID=your-bucket-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_COLLECTION_ID=your-collection-id
```

Replace the placeholders with your actual Appwrite values.

### Running the Application

To start the development server, run:

```bash
npm run dev
```

## 🗂️ Project Structure

```plaintext
src/
├── components/          # Sectioned React components
├── api/                 # Appwrite service for API calls
├── index.css            # Global styles and Tailwind configuration
├── App.tsx              # Main application component
├── main.tsx             # Entry point for React
```
## 📝 Future Improvements

- Enhanced UI/UX
- User authentication via Appwrite
- Unit and E2E testing
- Performance optimizations for large galleries
- Pagination for image lists

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request for suggestions or improvements.

## 📄 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE.txt) file for details