import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, expect, test } from "vitest";
import App from "../App";
import { MemoryRouter } from "react-router-dom";

//Mock react-select
vi.mock("react-select", () => ({
  default: ({ options, onChange, placeholder, value }) => (
    <select
      aria-label={placeholder}
      value={value ? value.value : ""}
      onChange={(e) => {
        const val = e.target.value;
        const option = options.find((o) => String(o.value) === String(val));
        onChange(option || null);
      }}
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

// Mock react-datepicker
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




//Test 1: Testing multiple filters together
test("filters properties by type AND price together", async () => {
  const user = userEvent.setup();

  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({
        properties: [
          {
            id: 1,
            type: "House",
            price: 200000,
            bedrooms: 2,
            location: "BR1",
            picture: "p.jpg",
            shortDescription: "Cheap House",
            added: { day: 1, month: "Jan", year: 2025 },
          },
          {
            id: 2,
            type: "Flat",
            price: 800000,
            bedrooms: 3,
            location: "BR2",
            picture: "p.jpg",
            shortDescription: "Expensive Flat",
            added: { day: 1, month: "Jan", year: 2025 },
          },
          {
            id: 3,
            type: "House",
            price: 800000,
            bedrooms: 4,
            location: "BR3",
            picture: "p.jpg",
            shortDescription: "Perfect House",
            added: { day: 1, month: "Jan", year: 2025 },
          },
        ],
      }),
    })
  );

  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  await screen.findByText("Cheap House");
  
  const typeSelect = screen.getByLabelText("Select Type");
  await user.selectOptions(typeSelect, "House");

  const minPriceSelect = screen.getByLabelText("Min Price ($)");
  await user.selectOptions(minPriceSelect, "400000");
  
  await user.click(screen.getByRole("button", { name: /Search/i }));

  expect(screen.queryByText("Cheap House")).not.toBeInTheDocument();
  expect(screen.queryByText("Expensive Flat")).not.toBeInTheDocument();
  
  expect(screen.getByText("Perfect House")).toBeInTheDocument();
});




//Test 2: Testing the date picker
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
  await user.type(dateInput, "2024-01-01");

  const select = screen.getByLabelText("Select Type");
  await user.selectOptions(select, "House");

  await user.click(screen.getByRole("button", { name: /Search/i }));

  expect(screen.queryByText("Old House")).not.toBeInTheDocument();
  expect(screen.getByText("New House")).toBeInTheDocument();
});

// Test 3: Testing if the favourites are saved in local storage
test("adds and removes properties in localStorage", async () => {
  const user = userEvent.setup();

  
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          properties: [
            {
              id: 1,
              type: "House",
              price: 300000,
              bedrooms: 3,
              location: "BR1",
              picture: "house.jpg",
              shortDescription: "Lovely House",
              added: { day: 1, month: "Jan", year: 2025 },
            },
          ],
        }),
    })
  );

  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  
  await screen.findByText("Lovely House");

  const addBtn = screen.getByRole("button", { name: /Add to favourites/i });
  await user.click(addBtn);

  let storedFavourites = JSON.parse(localStorage.getItem("favourites"));
  expect(storedFavourites).toHaveLength(1);
  expect(storedFavourites[0].shortDescription).toBe("Lovely House");

  const removeBtn = screen.getAllByRole("button", { name: /Remove/i }).find(
    (btn) => btn.className.includes("remove-button")
  );
  await user.click(removeBtn);

  storedFavourites = JSON.parse(localStorage.getItem("favourites"));
  expect(storedFavourites).toHaveLength(0);
});