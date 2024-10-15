# Roozna React Search

A simple React SearchBar component for Roozna API.

You can create an API key [here](https://search.roozna.com/).

## Installation

```bash
npm i @roozna/react-search
```

## Usage
### We recommend that you create a Searchbar component in your project and use it in your app.
`/src/components/Searchbar.tsx`

```jsx
'use client' // This is necessary for Next.js 13
import { Searchbar as RooznaSearchbar } from '@roozna/react-search'

export function Searchbar() {
  return <RooznaSearchbar 
  apiKey="YOUR_API_KEY" 
  onSelect={(company) => {
    console.log(company)
  }}
  />
}
```

## Props

- `onSelect`: Function to handle the selection of a company.
- `apiKey`: Your Roozna API key.
- `mainColor`: The main color for the search bar.

