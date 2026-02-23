import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/instance";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    dob: "",
    zodiacSign: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [userMeta, setUserMeta] = useState({}); // role, isActive, etc.

  // Load user data on mount - PERFECT API MAPPING
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const user = res.data.user;

          // ✅ EXACT FIELD MAPPING from API response
          const userData = {
            name: user.name || "",
            mobile: user.mobile || "",
            dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
            zodiacSign: user.zodiacSign || "",
          };

          setFormData(userData);
          setOriginalData(userData);

          // ✅ Meta data for display only
          setUserMeta({
            role: user.role || "devotee",
            isActive: user.isActive || false,
            isVerified: user.isVerified || false,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt,
          });

          // Avatar (if backend returns it)
          if (user.profilePic) setAvatarPreview(user.profilePic);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const updateData = new FormData();

      // ✅ SEND EXACT API FIELDS
      updateData.append("name", formData.name);
      updateData.append("mobile", formData.mobile);
      updateData.append("dob", formData.dob);
      updateData.append("zodiacSign", formData.zodiacSign);

      const res = await axiosInstance.put("/auth/profile", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setOriginalData(formData);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="profile-page1">
      <div className="profile-container1">
        {/* Header */}
        <div className="profile-header1">
          <h1 className="profile-title1">My Profile</h1>
          <p className="profile-subtitle1">
            {hasChanges()
              ? "Unsaved changes detected"
              : "Update your devotee details"}
          </p>
        </div>

        {/* Avatar & Status */}
        <div className="avatar-section">
          <div className="avatar-wrapper">
            <div className="avatar-container">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="profile-avatar-img"
                />
              ) : (
                <div className="avatar-placeholder">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      stroke="#999"
                      strokeWidth="2"
                    />
                    <path
                      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                      stroke="#999"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="avatar-actions">
              <label className="avatar-btn primary">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>

          {/* ✅ Status Badge */}
          <div className="status-badges">
            <span
              className={`badge ${
                userMeta.isVerified ? "verified" : "pending"
              }`}
            >
              {userMeta.isVerified ? "✅ Verified" : "Pending"}
            </span>
            <span
              className={`badge ${userMeta.isActive ? "active" : "inactive"}`}
            >
              {userMeta.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Editable Form - API Fields Only */}
        <div className="profile-form">
          <div className="form-group full-width">
            <label>Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter full name"
            />
          </div>

          <div className="form-group full-width">
            <label>Mobile Number</label>
            <input
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              disabled // Verified mobile typically read-only
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Zodiac Sign</label>
              <select
                name="zodiacSign"
                value={formData.zodiacSign}
                onChange={handleInputChange}
              >
                <option value="aries">Aries ♈</option>
                <option value="taurus">Taurus ♉</option>
                <option value="gemini">Gemini ♊</option>
                <option value="cancer">Cancer ♋</option>
                <option value="leo">Leo ♌</option>
                <option value="virgo">Virgo ♍</option>
                <option value="libra">Libra ♎</option>
                <option value="scorpio">Scorpio ♏</option>
                <option value="sagittarius">Sagittarius ♐</option>
                <option value="capricorn">Capricorn ♑</option>
                <option value="aquarius">Aquarius ♒</option>
                <option value="pisces">Pisces ♓</option>
              </select>
            </div>
          </div>

          {/* ✅ Read-only Account Info */}
          <div className="info-section">
            <h3>Account Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <span>Role:</span> <strong>{userMeta.role}</strong>
              </div>
              <div className="info-item">
                <span>Joined:</span>{" "}
                <strong>
                  {new Date(userMeta.createdAt).toLocaleDateString()}
                </strong>
              </div>
              <div className="info-item">
                <span>Last Login:</span>{" "}
                <strong>
                  {new Date(userMeta.lastLoginAt).toLocaleDateString()}
                </strong>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              className="btn secondary"
              onClick={() => navigate("/")}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className={`btn primary ${hasChanges() ? "active" : ""}`}
              onClick={handleSave}
              disabled={!hasChanges() || saving}
            >
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
