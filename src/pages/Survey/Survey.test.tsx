import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Survey from "../Survey";
import type { SurveyEntry } from "../../utils/types";

// Define types for Table component props
interface TableConfig<T> {
  label: string;
  render: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
}

interface TableProps<T> {
  data: T[];
  config: TableConfig<T>[];
  keyFn: (row: T) => string;
}

// Mock the Table component
vi.mock("../../components/common/Table", () => ({
  default: <T,>({ data, config, keyFn }: TableProps<T>) => (
    <div>
      Mocked Table
      {data.map((row: T) => (
        <div key={keyFn(row)}>
          {(row as SurveyEntry).userId} -{" "}
          {config.find((c) => c.label === "Conditions")?.render(row)}
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

const renderWithRouter = () =>
  render(
    <MemoryRouter>
      <Survey />
    </MemoryRouter>
  );

describe("Survey Component", () => {
  it("renders survey data correctly", () => {
    const mockSurveys: SurveyEntry[] = [
      {
        _id: "1",
        userId: "12345",
        age: "28",
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
        timestamp: new Date().toISOString(),
      },
      {
        _id: "2",
        userId: "WEB_SIMULATION", // Should be filtered out
        age: "30",
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
        timestamp: new Date().toISOString(),
      },
    ];

    vi.mocked(useGetAllSurveysQuery).mockReturnValue({
      data: mockSurveys,
      isLoading: false,
      error: undefined,
      isSuccess: true,
      isError: false,
      isFetching: false,
      isUninitialized: false,
      refetch: vi.fn(),
      startedTimeStamp: Date.now(),
      fulfilledTimeStamp: Date.now(),
      currentData: mockSurveys,
      endpointName: "getAllSurveys",
      requestId: "test-request-id",
      originalArgs: undefined,
      status: "fulfilled",
    });

    renderWithRouter();

    expect(screen.getByText("Survey Results")).toBeInTheDocument();
    expect(screen.getByText("Mocked Table")).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("12345"))
    ).toBeInTheDocument();
    expect(screen.queryByText("WEB_SIMULATION")).not.toBeInTheDocument(); // Filtered
    expect(screen.getByText("Hypertension")).toBeInTheDocument();
  });

  it("handles loading state", () => {
    vi.mocked(useGetAllSurveysQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
      isSuccess: false,
      isError: false,
      isFetching: true,
      isUninitialized: false,
      refetch: vi.fn(),
      startedTimeStamp: Date.now(),
      fulfilledTimeStamp: undefined,
      currentData: undefined,
      endpointName: "getAllSurveys",
      requestId: "test-request-id",
      originalArgs: undefined,
      status: "pending",
    });

    renderWithRouter();
    expect(screen.getByText("Survey Results")).toBeInTheDocument();
    expect(screen.getByText("Loading survey results...")).toBeInTheDocument();
  });

  it("handles error state", () => {
    vi.mocked(useGetAllSurveysQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { status: 500, data: { message: "Failed to fetch" } },
      isSuccess: false,
      isError: true,
      isFetching: false,
      isUninitialized: false,
      refetch: vi.fn(),
      startedTimeStamp: Date.now(),
      fulfilledTimeStamp: undefined,
      currentData: undefined,
      endpointName: "getAllSurveys",
      requestId: "test-request-id",
      originalArgs: undefined,
      status: "rejected",
    });

    renderWithRouter();
    expect(screen.getByText("Survey Results")).toBeInTheDocument();
    expect(
      screen.getByText("Error loading survey results.")
    ).toBeInTheDocument();
  });

  it("handles empty data state", () => {
    vi.mocked(useGetAllSurveysQuery).mockReturnValue({
      data: [],
      isLoading: false,
      error: undefined,
      isSuccess: true,
      isError: false,
      isFetching: false,
      isUninitialized: false,
      refetch: vi.fn(),
      startedTimeStamp: Date.now(),
      fulfilledTimeStamp: Date.now(),
      currentData: [],
      endpointName: "getAllSurveys",
      requestId: "test-request-id",
      originalArgs: undefined,
      status: "fulfilled",
    });

    renderWithRouter();
    expect(screen.getByText("Survey Results")).toBeInTheDocument();
    expect(screen.getByText("No survey results found.")).toBeInTheDocument();
  });
});
