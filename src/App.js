import React, { useState, useEffect } from "react";
import axios from "axios";
import UserProfileForm from "./UserProfileForm";
import "./App.css"; 

const Table = () => {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortKey, setSortKey] = useState(""); 
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUserId, setEditingUserId] = useState(null); 
  const [selectedUser, setSelectedUser] = useState(null); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://602e7c2c4410730017c50b9d.mockapi.io/users"
      );
      setData(response.data);
      setSortedData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSort = (key) => {
    setSortKey(key);
    const sorted = [...sortedData].sort((a, b) =>
      a.profile[key].toLowerCase().localeCompare(b.profile[key].toLowerCase())
    );
    setSortedData(sorted);
  };

  const handleSearch = () => {
    const filteredData = data.filter((item) => {
      const nameMatch =
        item.profile.firstName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.profile.lastName.toLowerCase().includes(searchQuery.toLowerCase());
      const emailMatch = item.profile.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return nameMatch || emailMatch;
    });
    setSortedData(filteredData);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (userId) => {
    setEditingUserId(userId);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null); 
  };

  const handleSaveEdit = (editedUser) => {
    const updatedData = data.map((item) =>
      item.id === editedUser.id
        ? { ...item, profile: editedUser.profile }
        : item
    );
    setData(updatedData);
    setSortedData(updatedData); 
    setEditingUserId(null); 
  };
  const handleRowClick = (userId) => {
    const user = sortedData.find((item) => item.id === userId);
    setSelectedUser(user);
    console.log(user);
  };
  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  return (
    <div className="container">
      <h1>Welcome to Our User Management System</h1>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by Name or Email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      <table>
        <thead>
          <tr className="head">
            <th onClick={() => handleSort("firstName")}>
              First Name {sortKey === "firstName" && "▲"}
            </th>
            <th onClick={() => handleSort("lastName")}>
              Last Name {sortKey === "lastName" && "▲"}
            </th>
            <th onClick={() => handleSort("email")}>
              Email {sortKey === "email" && "▲"}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <React.Fragment key={item.id}>
              {editingUserId === item.id ? (
                <tr>
                  <td colSpan="4">
                    <div className="user-profile-form">
                      <UserProfileForm
                        user={item}
                        onSave={handleSaveEdit}
                        onCancel={handleCancelEdit}
                      />
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {selectedUser && selectedUser.id === item.id ? (
                    <tr>
                      <td colSpan="4">
                        <div className="user-card">
                          <h2>User Details</h2>
                          <div className="user-details">
                            <img src={"https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=2000"} alt="User Avatar" />
                            <div>
                              <h3>
                                {selectedUser.profile.firstName}{" "}
                                {selectedUser.profile.lastName}
                              </h3>
                              <p>Email: {selectedUser.profile.email}</p>
                              <p>Job Title: {selectedUser.jobTitle}</p>
                              <p>Bio: {selectedUser.Bio}</p>
                            </div>
                          </div>
                          <button onClick={() => setSelectedUser(null)}>
                            Close
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr onClick={() => handleRowClick(item.id)}>
                      <td>{item.profile.firstName}</td>
                      <td>{item.profile.lastName}</td>
                      <td>{item.profile.email}</td>
                      <td>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(item.id)}
                        >
                          Edit Profile
                        </button>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(sortedData.length / 10) }).map(
          (_, index) => (
            <button
              className={`pagination-button ${
                currentPage === index + 1 ? "selected" : ""
              }`}
              key={index}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Table;
