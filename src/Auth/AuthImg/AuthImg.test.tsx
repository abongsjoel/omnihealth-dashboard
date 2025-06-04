import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import AuthImg from "../AuthImg";
import { act } from "react";

describe("AuthImg Component", () => {
  const images = ["/img1.png", "/img2.png", "/img3.png"];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the first image initially", () => {
    render(<AuthImg images={images} />);
    const img = screen.getByAltText("Login visual") as HTMLImageElement;
    expect(img.src).toContain(images[0]);
  });

  it("cycles through images every 30 seconds", () => {
    render(<AuthImg images={images} />);

    act(() => {
      vi.advanceTimersByTime(30000); // simulate 30 seconds
    });

    const img1 = screen.getByAltText("Login visual") as HTMLImageElement;
    expect(img1.src).toContain(images[1]);

    act(() => {
      vi.advanceTimersByTime(30000); // simulate another 30s
    });

    const img2 = screen.getByAltText("Login visual") as HTMLImageElement;
    expect(img2.src).toContain(images[2]);
  });

  it("removes loading class when image loads", () => {
    render(<AuthImg images={images} />);
    const img = screen.getByAltText("Login visual");
    expect(img).toHaveClass("loading");

    act(() => {
      img.dispatchEvent(new Event("load"));
    });

    expect(img).not.toHaveClass("loading");
  });
});
