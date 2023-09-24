import React, { useState } from 'react';

const UserProfileForm = ({ user, onSave, onCancel }) => {
  const [editedProfile, setEditedProfile] = useState({ ...user.profile });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...user, profile: editedProfile });
  };

  return (
    <div className="user-profile-form">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={editedProfile.firstName}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={editedProfile.lastName}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={editedProfile.email}
          onChange={handleInputChange}
          required
        />

        <div className="form-buttons">
          <button type="submit">Save</button>
          <button className="cancel-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;
