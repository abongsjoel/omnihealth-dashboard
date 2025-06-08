import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import Modal from "../Modal";

describe("Modal Component", () => {
  const modalContent = <div data-testid="modal-content">Hello Modal</div>;

  it("does not render when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        {modalContent}
      </Modal>
    );
    expect(screen.queryByTestId("modal-content")).not.toBeInTheDocument();
  });

  it("renders children when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        {modalContent}
      </Modal>
    );
    expect(screen.getByTestId("modal-content")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        {modalContent}
      </Modal>
    );

    const closeButton = screen.getByRole("button", { name: /x/i });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when clicking on the overlay", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        {modalContent}
      </Modal>
    );

    fireEvent.click(screen.getByTestId("modal-overlay"));
    expect(onClose).toHaveBeenCalled();
  });

  it("does not call onClose when clicking inside modal content", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        {modalContent}
      </Modal>
    );

    fireEvent.click(screen.getByTestId("modal-content"));
    expect(onClose).not.toHaveBeenCalled();
  });
});
