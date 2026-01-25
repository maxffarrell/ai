# Search Filter Component

Create a Svelte 5 search filter component with:

- Props: `items` (object[]), `searchFields` (string[])
- Case-insensitive matching across specified fields
- Display filtered count showing "X results"

## Requirements

- Use `$props()` for component props
- Use `$state()` for the search query
- Use `$derived()` for filtered items and result count
- Search input should have `role="searchbox"`
- Display each filtered item using the first searchField for display text
- Show result count in format "X results" (e.g., "2 results", "0 results")
