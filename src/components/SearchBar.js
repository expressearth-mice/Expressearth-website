import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [blogsRes, casesRes, destsRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/posts/'),
          fetch('http://127.0.0.1:8000/api/casestudies/'),
          fetch('http://127.0.0.1:8000/api/destinations/'),
        ]);

        const blogs = await blogsRes.json();
        const cases = await casesRes.json();
        const destinations = await destsRes.json();

        const formatted = [
          ...blogs.map(item => ({
            ...item,
            type: 'blog',
            label: item.title || '',
            slug: item.slug,
          })),
          ...cases.map(item => ({
            ...item,
            type: 'caseStudy',
            label: item.name || '',
            slug: item.slug,
          })),
          ...destinations.map(item => ({
            ...item,
            type: 'destination',
            label: item.name || '',
            slug: item.slug,
          })),
        ];

        setAllData(formatted);
      } catch (error) {
        console.error('Search data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const lower = query.trim().toLowerCase();
    if (!lower) {
      setResults([]);
    } else {
      const filtered = allData.filter(item =>
        item.label.toLowerCase().includes(lower)
      );
      setResults(filtered.slice(0, 5));
    }
  }, [query, allData]);

  const getLink = (item) => {
    if (!item.slug) return '#';
    switch (item.type) {
      case 'blog': return `/blogs/${item.title}`;
      case 'caseStudy': return `/case-studies/${item.slug}`;
      case 'destination': return `/destinations/${item.name}`;
      default: return '#';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'blog': return '📝 Blog';
      case 'caseStudy': return '📊 Case Study';
      case 'destination': return '🌍 Destination';
      default: return '';
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {query && (
        <div className="search-results-dropdown">
          {loading && <div>Loading...</div>}

          {!loading && results.length > 0 && (
            results.map((item, index) => (
              <Link to={getLink(item)} key={index} className="search-result-item">
                <div>
                  <strong>{item.label}</strong>
                  <div className="type-label">{getTypeLabel(item.type)}</div>
                </div>
              </Link>
            ))
          )}

          {!loading && results.length === 0 && (
            <div className="no-results">No results found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
