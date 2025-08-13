import React from 'react';
import { Link } from 'react-router-dom';

import UploadPage from './UploadPage';

import GalleryPage from './GalleryPage';
const Home = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
     Home
      <UploadPage/>

      <GalleryPage/>
    </div>
  );
};

export default Home;
