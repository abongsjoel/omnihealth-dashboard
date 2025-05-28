import React from "react";
import "./Thumbnail.scss";

interface ThumbnailProps {
  name: string;
  imageUrl?: string;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ name, imageUrl }) => {
  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    const first = words[0]?.charAt(0).toUpperCase() ?? "";
    const second = words[1]?.charAt(0).toUpperCase() ?? "";
    return first + second;
  };

  const initials = getInitials(name);

  return (
    <div className="thumbnail">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${name}'s profile`}
          className="thumbnail_img"
        />
      ) : (
        <span className="thumbnail_initial">{initials}</span>
      )}
    </div>
  );
};

export default Thumbnail;
