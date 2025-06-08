import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Table from "../Table";

interface User {
  id: number;
  name: string;
  email: string;
}

const sampleData: User[] = [
  { id: 1, name: "Ada Lovelace", email: "ada@math.net" },
  { id: 2, name: "Alan Turing", email: "alan@computing.org" },
];

const tableConfig = [
  {
    label: "Name",
    render: (user: User) => user.name,
  },
  {
    label: "Email",
    render: (user: User) => user.email,
  },
];

describe("Table Component", () => {
  it("renders column headers correctly", () => {
    render(
      <Table data={sampleData} config={tableConfig} keyFn={(row) => row.id} />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders table rows with correct content", () => {
    render(
      <Table data={sampleData} config={tableConfig} keyFn={(row) => row.id} />
    );

    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("ada@math.net")).toBeInTheDocument();
    expect(screen.getByText("Alan Turing")).toBeInTheDocument();
    expect(screen.getByText("alan@computing.org")).toBeInTheDocument();
  });

  it("renders custom headers if provided", () => {
    const configWithCustomHeader = [
      {
        label: "Name",
        header: () => <th data-testid="custom-header">Custom Name</th>,
        render: (user: User) => user.name,
      },
    ];

    render(
      <Table
        data={sampleData}
        config={configWithCustomHeader}
        keyFn={(row) => row.id}
      />
    );

    expect(screen.getByTestId("custom-header")).toHaveTextContent(
      "Custom Name"
    );
  });
});
