# Roozna React Search

A simple React SearchBar component for Roozna API.

You can create an API key [here](https://search.roozna.com/).

## Installation

```bash
npm install roozna-react-search
```

## Usage

```jsx
import { Searchbar } from 'roozna-react-search';

const App = () => {
  const handleSelect = (company: any) => {
    console.log('Selected company:', company)
  }

  return (
    <div className="App">
      <h1>Roozna React Search Test</h1>
      <Searchbar
        onSelect={handleSelect}
        apiKey='{process.env.REACT_APP_ROOZNA_API_KEY}'
        mainColor='#8B5CF6' />
    </div>
  )
}

export default App
```

## Props

- `onSelect`: Function to handle the selection of a company.
- `apiKey`: Your Roozna API key.
- `mainColor`: The main color for the search bar.

## License

This project is licensed under the MIT License.