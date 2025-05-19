import React from "react";
import "./Modal.scss";
import Button from "../Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <section className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <Button className="modal-close" onClick={onClose}>
          X
        </Button>
        {children}
      </div>
    </section>
  );
};

export default Modal;
