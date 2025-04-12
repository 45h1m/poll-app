import { useState, useEffect, createContext, useContext } from "react";

// Create context for controlling the modal
const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export default function ModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {isOpen && (
        <Modal isOpen={isOpen} onClose={closeModal}>
          {modalContent}
        </Modal>
      )}
    </ModalContext.Provider>
  );
}

function Modal({ isOpen, onClose, children }) {
  const [animation, setAnimation] = useState(isOpen ? "enter" : "exit");

  useEffect(() => {
    setAnimation(isOpen ? "enter" : "exit");
  }, [isOpen]);

  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`fixed inset-0 z-50 p-4 flex items-center justify-center bg-black/50 bg-opacity-50 transition-opacity duration-300 ${
        animation === "enter" ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`max-w-lg w-full bg-white rounded-lg shadow-xl transition-all duration-300 ${
          animation === "enter"
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4"
        }`}
        onClick={handleModalClick}
      >
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

