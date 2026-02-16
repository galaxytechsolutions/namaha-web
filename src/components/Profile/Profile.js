import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; // Create this CSS file

function Profile() {
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    firstName: 'Vashin',
    lastName: 'Chowdhury',
    email: 'vashin@example.com',
    phone: '+92 345 6789',
    city: 'New York',
    state: '',
    country: 'USA',
    zip: '10001',
    taxId: 'LKUK534563',
    company: '',
    language: 'English',
    bio: 'Best Experence'
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Save logic here
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    // Reset form or navigate back
    navigate(-3);
  };

  return (
    <div className="profile-page1">
      <div className="profile-container1">
        {/* Header */}
        <div className="profile-header1">
          <h1 className="profile-title1">My Profile</h1>
        </div>

        {/* Avatar Section */}
        <div className="avatar-section">
          <div className="avatar-wrapper">
            <div className="avatar-container">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile" className="profile-avatar-img" />
              ) : (
                <div className="avatar-placeholder">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="7" r="4" stroke="#999" strokeWidth="2" />
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#999" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>
            <div className="avatar-actions">
              <label className="avatar-btn primary">
                Change
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              </label>
              <button className="avatar-btn secondary">Remove</button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
              />
            </div>
            <div className="form-group">
              <label>City/State</label>
              <input 
                type="text" 
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
              />
              {/* <input 
                type="text" 
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State"
                className="small-input"
              /> */}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Country</label>
              <select 
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              >
                <option>USA</option>
                <option>Canada</option>
                <option>UK</option>
              </select>
            </div>
            <div className="form-group">
              <label>ZIP</label>
              <input 
                type="text" 
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                placeholder="ZIP"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>TAX ID</label>
              <input 
                type="text" 
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                placeholder="TAX ID"
              />
            </div>
            <div className="form-group">
              <label>Company Name</label>
              <input 
                type="text" 
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Company Name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Language</label>
              <select 
                name="language"
                value={formData.language}
                onChange={handleInputChange}
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Bio</label>
            <textarea 
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="4"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="button" className="btn secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" className="btn primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
