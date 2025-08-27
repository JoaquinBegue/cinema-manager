import { useState } from 'react'
import { Form } from 'react-bootstrap'


function SearchBar({ placeholder, objects, handleSelection }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const searchObject = (searchQuery) => {
    setSearchQuery(searchQuery);
    if (searchQuery.length > 2) {
      let results = objects.filter((object) =>
        object.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  return (
    <Form className="navbar-right d-flex position-relative search-bar">
      {/* Search input */}
      <Form.Control
        type="search"
        placeholder={placeholder}
        className="ms-auto me-2 w-75"
        aria-label="Search"
        value={searchQuery}
        onChange={(e) => searchObject(e.target.value)}
        onFocus={() => searchQuery.length > 2 && setShowResults(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && searchResults.length > 0) {
            e.preventDefault();
            handleSelection(searchResults[0].id);
          }
        }}
      />
      {/* Search results dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="search-results-dropdown ms-auto me-2">
          {searchResults.map((object) => (
            <div
              key={object.id}
              className="search-result-item"
              onClick={() => handleSelection(object.id)}
            >
              {object.label}
            </div>
          ))}
        </div>
      )}
    </Form>
  )
}

export default SearchBar
