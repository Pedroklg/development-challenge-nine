import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
        navigate("/");
        }, 5000);
    }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl">Page Not Found going to Home page in 5 seconds</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        onClick={() => navigate('/')}
      >
        Go to Home
      </button>
    </div>
  );
};

export default PageNotFound;