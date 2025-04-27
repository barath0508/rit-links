import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-4xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mt-4 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/"
          className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <HomeIcon className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;