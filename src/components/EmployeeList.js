import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../redux/employeeSlice';
import styles from './EmployeeList.module.css';

const EmployeeList = () => {
  // Redux dispatch function to fetch employees
  const dispatch = useDispatch();
  // Extract data from Redux store
  const { employees, loading, error } = useSelector((state) => state.employees);

  // Local state for pagination and filters
  const [visibleEmployees, setVisibleEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('');

  // Fetch employees from the API when the component mounts
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // List of US states and territories for filtering
  const usStatesAndTerritories = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
    "American Samoa", "Guam", "Northern Mariana Islands", "Puerto Rico", "United States Minor Outlying Islands"
  ];

  // Filter employees based on the selected filters
  const filteredEmployees = useMemo(() => {
    let result = [...employees];

    // Apply country filter
    if (country) {
      if (country === "United States") {
        result = result.filter(employee => {
          const address = employee.address || {};
          const state = address.state;
          return state && usStatesAndTerritories.includes(state);
        });
      } else {
        result = result.filter(employee => {
          const address = employee.address || {};
          return address.country === country || address.state === country;
        });
      }
    }

    // Apply gender filter
    if (gender) {
      result = result.filter(employee => employee.gender === gender);
    }

    return result;
  }, [employees, country, gender]);

  // Update visible employees based on pagination
  useEffect(() => {
    setVisibleEmployees(filteredEmployees.slice(0, (page + 1) * 10));
  }, [filteredEmployees, page]);

  // Handle scroll event to load more employees when scrolled near the bottom
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      if (visibleEmployees.length < filteredEmployees.length) {
        setPage(prevPage => prevPage + 1);
      }
    }
  };

  // Add and remove scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleEmployees.length, filteredEmployees.length]);

  // Generate list of unique countries for the dropdown
  const uniqueCountries = useMemo(() => {
    const countryList = [...new Set(employees.map(e => e.address.country))];
    if (countryList.includes("United States")) {
      return [...countryList, ...usStatesAndTerritories];
    }
    return countryList;
  }, [employees]);

  // Display loading or error message if applicable
  if (loading && employees.length === 0) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/logo.jpg" alt="Pixel6 Logo" className={styles.logo} />
        <div className={styles.menuIcon} onClick={() => alert('Menu Icon Clicked')}>
          <i className="fas fa-bars"></i> 
        </div>
      </div>
      <h1 className={styles.title}>Employees</h1>
      <div className={styles.filters}>
        <select
          className={styles.select}
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setPage(0); // Reset pagination when filter changes
          }}
        >
          <option value="">Country</option>
          {uniqueCountries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        <select
          className={styles.select}
          value={gender}
          onChange={(e) => {
            setGender(e.target.value);
            setPage(0); // Reset pagination when filter changes
          }}
        >
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Full Name</th>
            <th>Demography</th>
            <th>Designation</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {visibleEmployees.map((employee) => (
            <tr key={employee.id}>
              <td data-label="ID">{employee.id}</td>
              <td data-label="Image">
                <img
                  src={employee.image}
                  alt={employee.firstName}
                  className={styles.avatar}
                />
              </td>
              <td data-label="Full Name">{`${employee.firstName} ${employee.lastName}`}</td>
              <td data-label="Demography">{`${employee.gender.charAt(0).toUpperCase()}/${employee.age}`}</td>
              <td data-label="Designation">{employee.company.title}</td>
              <td data-label="Location">{`${employee.address.city}, ${employee.address.state}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div>Loading more...</div>}
    </div>
  );
};

export default EmployeeList;
