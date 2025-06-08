import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Icon from "../Icon";

// Mock SVG icons
vi.mock("../../../assets/icons/iconLib", () => ({
  default: {
    bin: {
      default: '<svg><path d="M1 2" /><path d="M3 4" /></svg>',
      inverse: '<svg><path d="M5 6" /></svg>',
    },
  },
}));

// Mock react-inlinesvg to avoid external request behavior
vi.mock("react-inlinesvg", () => ({
  __esModule: true,
  default: ({ src, ...props }: { src: string }) => (
    <div data-testid="inlinesvg" {...props}>
      InlineSVG: {src}
    </div>
  ),
}));

describe("Icon component", () => {
  it("renders default SVG with paths", () => {
    render(<Icon title="bin" />);
    const svg = screen.getByTestId("icon");
    expect(svg).toBeInTheDocument();
    expect(svg.querySelectorAll("path")).toHaveLength(2);
    expect(svg).toHaveClass("icon", "icon_md");
  });

  it("applies correct size and custom class", () => {
    render(<Icon title="bin" size="lg" className="custom-class" />);
    const svg = screen.getByTestId("icon");
    expect(svg).toHaveClass("icon_lg", "custom-class");
  });

  it("renders inverse icon", () => {
    render(<Icon title="bin" inverse />);
    const svg = screen.getByTestId("icon");
    expect(svg).toHaveClass("inverse");
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Icon title="bin" onClick={handleClick} />);
    fireEvent.click(screen.getByTestId("icon"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders original SVG when showOriginal is true", () => {
    render(<Icon title="bin" showOriginal />);
    const inlineSvg = screen.getByTestId("inlinesvg");
    expect(inlineSvg).toBeInTheDocument();
    expect(inlineSvg).toHaveTextContent("InlineSVG:");
  });
});
