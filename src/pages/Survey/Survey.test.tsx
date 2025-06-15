import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Survey from "../Survey";

// Mock the Table component
vi.mock("../../components/common/Table", () => ({
  default: ({ data, config, keyFn }: any) => (
    <div>
      Mocked Table
      {data.map((row: any) => (
        <div key={keyFn(row)}>
          {row.userId} -{" "}
          {config.find((c: any) => c.label === "Conditions")?.render(row)}
        </div>
      ))}
    </div>
  ),
}));

// Mock RTK Query hook
vi.mock("../../redux/apis/surveysApi", async () => {
  const actual = await vi.importActual("../../redux/apis/surveysApi");
  return {
    ...actual,
    useGetAllSurveysQuery: vi.fn(),
  };
});

import { useGetAllSurveysQuery } from "../../redux/apis/surveysApi";

describe("Survey Component", () => {
  it("renders survey data correctly", () => {
    const mockSurveys = [
      {
        _id: "1",
        userId: "12345",
        age: 28,
        gender: "Female",
        conditions: ["Hypertension"],
        duration: "2 months",
        caregiver: "Self",
        provider: "Clinic A",
        advice: "Yes",
        advice_understood: "Yes",
        treatment_explained: "Yes",
        clinic_visit: "No",
        challenge: "None",
        receive_care: "Home",
        interested: "Yes",
      },
      {
        _id: "2",
        userId: "WEB_SIMULATION", // Should be filtered out
        age: 30,
        gender: "Male",
        conditions: ["Diabetes"],
        duration: "1 year",
        caregiver: "Relative",
        provider: "Clinic B",
        advice: "Yes",
        advice_understood: "No",
        treatment_explained: "No",
        clinic_visit: "Yes",
        challenge: "Distance",
        receive_care: "Hospital",
        interested: "No",
      },
    ];

    (useGetAllSurveysQuery as any).mockReturnValue({
      data: mockSurveys,
      isLoading: false,
      error: null,
    });

    render(<Survey />);

    expect(screen.getByText("Survey Results")).toBeInTheDocument();
    expect(screen.getByText("Mocked Table")).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("12345"))
    ).toBeInTheDocument();
    expect(screen.queryByText("WEB_SIMULATION")).not.toBeInTheDocument(); // Filtered
    expect(screen.getByText("Hypertension")).toBeInTheDocument();
  });

  it("handles loading state", () => {
    (useGetAllSurveysQuery as any).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    });

    render(<Survey />);
    expect(screen.getByText("Survey Results")).toBeInTheDocument();
    expect(screen.getByText("Mocked Table")).toBeInTheDocument();
  });

  it("handles error state", () => {
    (useGetAllSurveysQuery as any).mockReturnValue({
      data: [],
      isLoading: false,
      error: { message: "Failed to fetch" },
    });

    render(<Survey />);
    expect(screen.getByText("Survey Results")).toBeInTheDocument();
    expect(screen.getByText("Mocked Table")).toBeInTheDocument();
  });
});
