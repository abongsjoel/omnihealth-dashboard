import React from "react";
import "./Users.scss";

const Skeleton: React.FC = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="user skeleton" />
      ))}
    </>
  );
};

export default Skeleton;
