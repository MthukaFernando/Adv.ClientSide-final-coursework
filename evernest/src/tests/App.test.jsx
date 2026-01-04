import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, expect, test } from "vitest";
import React from "react";
import App from "../App";
import { MemoryRouter } from "react-router-dom";

// Mock react-select
vi.mock("react-select", () => ({
  default: ({ options, onChange, placeholder, value }) => (
    <select
      aria-label={placeholder}
      value={value?.value || ""}
      onChange={(e) =>
        onChange(options.find((o) => o.value === e.target.value) || null)
      }
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
}));

// Mock react datepicker
vi.mock("react-datepicker", () => ({
  default: ({ onChange, selected }) => (
    <input
      type="date"
      placeholder="Listed after"
      onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
      value={selected ? selected.toISOString().split('T')[0] : ''}
    />
  ),
}));


// Testing the type filter
test("filters properties by type", async () => {
  const user = userEvent.setup();
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({
        properties: [
          { id: 1, type: "House", price: 100, bedrooms: 1, location: "BR1", picture: "p.jpg", shortDescription: "A House", added: { day: 1, month: "Jan", year: 2025 } },
          { id: 2, type: "Flat", price: 100, bedrooms: 1, location: "BR1", picture: "p.jpg", shortDescription: "A Flat", added: { day: 1, month: "Jan", year: 2025 } },
        ]
      }),
    })
  );

  render(<MemoryRouter><App /></MemoryRouter>);
  await screen.findByText("A House");

  const select = screen.getByLabelText("Select Type");
  await user.selectOptions(select, "House");
  await user.click(screen.getByRole("button", { name: /Search/i }));

  expect(screen.getByText("A House")).toBeInTheDocument();
  expect(screen.queryByText("A Flat")).not.toBeInTheDocument();
});

// Testing the date picker
test("filters properties by type and date", async () => {
  const user = userEvent.setup();
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({
          properties: [
            { id: 1, type: "House", shortDescription: "Old House", added: { day: 1, month: "Jan", year: 2023 }, price: 100, bedrooms: 1, location: "BR1", picture: "p.jpg" },
            { id: 2, type: "House", shortDescription: "New House", added: { day: 1, month: "Jan", year: 2025 }, price: 100, bedrooms: 1, location: "BR2", picture: "p.jpg" },
          ],
        }),
    })
  );

  render(<MemoryRouter><App /></MemoryRouter>);
  await screen.findByText(/everNest/i);

  const dateInput = screen.getByPlaceholderText("Listed after");
  // Using userEvent.type to match your style
  await user.type(dateInput, "2024-01-01");

  const select = screen.getByLabelText("Select Type");
  await user.selectOptions(select, "House");

  await user.click(screen.getByRole("button", { name: /Search/i }));

  expect(screen.queryByText("Old House")).not.toBeInTheDocument();
  expect(screen.getByText("New House")).toBeInTheDocument();
});