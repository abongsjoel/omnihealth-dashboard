import React from "react";
import "./Users.scss";

const UsersSkeleton: React.FC = () => {
  return (
    <>
      {Array.from({ length: 25 }).map((_, index) => (
        <div
          key={index}
          className="user skeleton"
          data-testid="user_skeleton"
          role="presentation"
        />
      ))}
    </>
  );
};

export default UsersSkeleton;
