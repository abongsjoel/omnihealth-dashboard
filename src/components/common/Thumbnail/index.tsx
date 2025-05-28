import React, { useRef, useState } from "react";
import "./Thumbnail.scss";

interface ThumbnailProps {
  name: string;
  imageUrl?: string;
  onLogout: () => void;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ name, imageUrl, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    const first = words[0]?.charAt(0).toUpperCase() ?? "";
    const second = words[1]?.charAt(0).toUpperCase() ?? "";
    return first + second;
  };

  const initials = getInitials(name);

  return (
    <div className="thumbnail_wrapper" ref={ref}>
      <div className="thumbnail" onClick={() => setIsOpen(!isOpen)}>
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

      {isOpen && (
        <div className="dropdown_menu">
          <p className="dropdown_item">{name}</p>
          <button className="dropdown_item" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Thumbnail;
