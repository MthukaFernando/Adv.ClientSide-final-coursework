import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, expect, test } from 'vitest';
import React from 'react';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';

// Mock the problematic third-party libraries
vi.mock('react-select', () => ({
  default: ({ options, onChange, placeholder }) => (
    <select 
      aria-label={placeholder}
      onChange={(e) => onChange(options.find(o => o.value === e.target.value))}
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}));

vi.mock('react-datepicker', () => ({
  default: () => <input type="date" />
}));

vi.mock('../FavouritesPanel', () => ({
  default: () => <div>Favourites Mock</div>
}));

test('filters properties by type', async () => {
  // Mock fetch data
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({
        properties: [{
          id: 1, type: "House", price: 100, bedrooms: 1, 
          location: "BR1", picture: "", shortDescription: "Desc",
          added: { day: 1, month: "Jan", year: 2023 }
        }]
      }),
    })
  );

  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  // Use waitFor to let React 19 finish its initial render cycle
  await waitFor(() => {
    expect(screen.getByText(/everNest/i)).toBeInTheDocument();
  });

  const select = screen.getByLabelText('Select Type');
  await userEvent.selectOptions(select, 'House');
  
  const searchBtn = screen.getByRole('button', { name: /Search/i });
  await userEvent.click(searchBtn);

  const results = await screen.findAllByText('House');
  expect(results.length).toBeGreaterThan(0);
});