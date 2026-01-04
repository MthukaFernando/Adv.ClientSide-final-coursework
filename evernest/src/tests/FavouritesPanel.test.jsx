import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import FavouritesPanel from "../FavouritesPanel";


// Test 1: Testing if properties can be successfully added to favourites
test("adds a property to favourites", async () => {
  const user = userEvent.setup();
  const property = {
    id: 1,
    type: "House",
    price: 300000,
    bedrooms: 3,
    location: "BR1",
    picture: "house.jpg",
  };

  const onAdd = vi.fn();
  const onRemove = vi.fn();
  const onRemoveAll = vi.fn();

  const { rerender } = render(
    <MemoryRouter>
      <FavouritesPanel
        favourites={[]}
        onAdd={onAdd}
        onRemove={onRemove}
        onRemoveAll={onRemoveAll}
      />
    </MemoryRouter>
  );

  onAdd(property);

  rerender(
    <MemoryRouter>
      <FavouritesPanel
        favourites={[property]}
        onAdd={onAdd}
        onRemove={onRemove}
        onRemoveAll={onRemoveAll}
      />
    </MemoryRouter>
  );

  expect(screen.getByText("Type: House")).toBeInTheDocument();
  expect(screen.getByText("Price: $300000")).toBeInTheDocument();
  expect(screen.getByText("Bedrooms: 3")).toBeInTheDocument();
});



// Test 2: Testing if properties can be successfully removed from favourites
test("removes a property from favourites", async () => {
  const user = userEvent.setup();

  const property = {
    id: 1,
    type: "House",
    price: 300000,
    bedrooms: 3,
    location: "BR1",
    picture: "house.jpg",
  };

  const onAdd = vi.fn();
  const onRemove = vi.fn();
  const onRemoveAll = vi.fn();

  render(
    <MemoryRouter>
      <FavouritesPanel
        favourites={[property]}
        onAdd={onAdd}
        onRemove={onRemove}
        onRemoveAll={onRemoveAll}
      />
    </MemoryRouter>
  );

  const removeBtn = screen
  .getAllByRole("button", { name: /Remove/i })
  .find((btn) => btn.className.includes("remove-button"));

await user.click(removeBtn);

expect(onRemove).toHaveBeenCalledWith(property.id);
});