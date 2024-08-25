import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [filteredData, setFilteredData] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' }
  ];

  useEffect(() => {
    document.title = '21BAI1198';
  }, []);

  const handleSubmit = async () => {
    setError('');
    try {
      const jsonParsed = JSON.parse(jsonInput);

      // Call the backend API
      const res = await axios.post('http://localhost:3000/bfhl', jsonParsed);

      if (res.status === 200) {
        setResponse(res.data);
      } else {
        setError('API responded with an error');
      }
    } catch (e) {
      if (e.response) {
        // API error
        setError('API Error: ' + (e.response.data?.message || 'Unknown error'));
      } else if (e.request) {
        // No response received
        setError('No response from API');
      } else {
        // JSON parsing error
        setError('Invalid JSON format');
      }
    }
  };

  const handleFilterChange = (selected) => {
    setSelectedOptions(selected);
    if (response) {
      const filtered = selected.reduce((acc, curr) => {
        acc[curr.value] = response[curr.value] || [];
        return acc;
      }, {});
      setFilteredData(filtered);
    }
  };

  return (
    <div className="App">
      <h1>Roll Number: 21BAI1198</h1>
      <div>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Enter JSON here'
          rows="5"
          cols="50"
        />
      </div>
      <button onClick={handleSubmit}>Submit</button>
      {error && <p className="error">{error}</p>}
      {response && (
        <>
          <Select
            isMulti
            options={options}
            onChange={handleFilterChange}
          />
          <div className="response">
            {Object.keys(filteredData).length > 0 ? (
              Object.keys(filteredData).map((key) => (
                <p key={key}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {filteredData[key].join(', ')}
                </p>
              ))
            ) : (
              <p>No data to display</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;