import React, { useEffect, useState } from "react";

import "./AuthImg.scss";

interface AuthImgProps {
  images: string[];
}

const AuthImg: React.FC<AuthImgProps> = ({ images, ...props }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentImageIndex + 1) % images.length;
      setCurrentImageIndex(nextIndex);
      setLoading(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [currentImageIndex, images.length]);

  return (
    <img
      {...props}
      src={images[currentImageIndex]}
      key={images[currentImageIndex]}
      className={`auth_img transition-img ${loading ? "loading" : ""}`}
      onLoad={() => setLoading(false)}
      alt="Login visual"
    />
  );
};

export default AuthImg;
