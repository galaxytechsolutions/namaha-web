import React, { useState, useEffect } from "react";
import axiosInstance from "../../lib/instance";
import BookingDetailsModal from "../BookingDetailsModal/BookingDetailsModal";
import "./MyBooking.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Modal state
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Mobile filter dropdown state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchBookings(activeFilter);
  }, [activeFilter]);

  const fetchBookings = async (filter = "all") => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get("/bookings", {
        params: { filter }
      });

      console.log("📋 Bookings data:", response.data);
      setBookings(response.data.bookings || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = (bookingId) => {
    console.log("Opening booking:", bookingId);
    setSelectedBookingId(bookingId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBookingId(null);
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      pending: "status-pending",
      panditAccepted: "status-accepted",
      inProgress: "status-ongoing",
      completed: "status-completed",
      expired: "status-expired",
      cancelled: "status-cancelled",
      panditRejected: "status-rejected"
    };
    return statusMap[status] || "status-default";
  };

  const getStatusText = (status) => {
    const textMap = {
      pending: "Pending",
      panditAccepted: "Accepted",
      inProgress: "Ongoing",
      completed: "Completed",
      expired: "Expired",
      cancelled: "Cancelled",
      panditRejected: "Rejected",
      all: "All",
      upcoming: "Upcoming"
    };
    return textMap[status] || status;
  };

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="bookings-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bookings-container">
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={() => fetchBookings(activeFilter)}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <h1>My Puja Bookings</h1>
        <p className="bookings-count">
          {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
        </p>
      </div>

      {/* Filters */}
      <div className="bookings-filters">
        {/* Desktop/Tablet Filters */}
        <div className="desktop-filters">
          <button
            className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${activeFilter === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveFilter("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`filter-btn ${activeFilter === "completed" ? "active" : ""}`}
            onClick={() => setActiveFilter("completed")}
          >
            Completed
          </button>
          <button
            className={`filter-btn ${activeFilter === "pending" ? "active" : ""}`}
            onClick={() => setActiveFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${activeFilter === "cancelled" ? "active" : ""}`}
            onClick={() => setActiveFilter("cancelled")}
          >
            Cancelled
          </button>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="mobile-filter-toggle">
          <button 
            className={`mobile-filter-btn ${showMobileFilters ? 'active' : ''}`}
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <span className="filter-icon">⟐</span>
            <span className="filter-text">
              {getStatusText(activeFilter)}
            </span>
            <span className="filter-chevron">▼</span>
          </button>
        </div>

        {/* Mobile Filter Dropdown */}
        {showMobileFilters && (
          <div className="mobile-filter-dropdown">
            <div 
              className={`filter-option ${activeFilter === "all" ? "active" : ""}`} 
              onClick={() => {
                setActiveFilter("all");
                setShowMobileFilters(false);
              }}
            >
              All
            </div>
            <div 
              className={`filter-option ${activeFilter === "upcoming" ? "active" : ""}`} 
              onClick={() => {
                setActiveFilter("upcoming");
                setShowMobileFilters(false);
              }}
            >
              Upcoming
            </div>
            <div 
              className={`filter-option ${activeFilter === "completed" ? "active" : ""}`} 
              onClick={() => {
                setActiveFilter("completed");
                setShowMobileFilters(false);
              }}
            >
              Completed
            </div>
            <div 
              className={`filter-option ${activeFilter === "pending" ? "active" : ""}`} 
              onClick={() => {
                setActiveFilter("pending");
                setShowMobileFilters(false);
              }}
            >
              Pending
            </div>
            <div 
              className={`filter-option ${activeFilter === "cancelled" ? "active" : ""}`} 
              onClick={() => {
                setActiveFilter("cancelled");
                setShowMobileFilters(false);
              }}
            >
              Cancelled
            </div>
          </div>
        )}
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🕉️</div>
          <h3>No bookings found</h3>
          <p>You haven't made any bookings yet</p>
          <button 
            className="book-now-btn"
            onClick={() => window.location.href = "/puja"}
          >
            Book a Puja
          </button>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              {/* Status Badge */}
              <div className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                {getStatusText(booking.status)}
              </div>

              {/* Puja Info */}
              <div className="booking-content">
                <h3 className="puja-name">
                  {booking.poojaId?.name || "Puja Booking"}
                </h3>
                <p className="puja-deity">
                  Deity: {booking.poojaId?.section || "N/A"}
                </p>

                {/* Pandit Info */}
                <div className="pandit-info">
                  <div className="pandit-avatar">
                    {booking.panditId?.profileImage?.url ? (
                      <img 
                        src={booking.panditId.profileImage.url} 
                        alt={booking.panditId.name}
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {booking.panditId?.name?.charAt(0) || "P"}
                      </div>
                    )}
                  </div>
                  <div className="pandit-details">
                    <span className="pandit-name">
                      👤 {booking.panditId?.name || "Pandit"}
                    </span>
                    <span className="pandit-rating">
                      ⭐ 4.5
                    </span>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="booking-datetime">
                  <div className="datetime-item">
                    <span className="icon">📅</span>
                    <span>{formatDate(booking.date)}</span>
                  </div>
                  <div className="datetime-item">
                    <span className="icon">🕐</span>
                    <span>{booking.slots[0]?.start}</span>
                  </div>
                  <div className="datetime-item">
                    <span className="icon">⏱️</span>
                    <span>{booking.duration}</span>
                  </div>
                </div>

                {/* Mode Badge */}
                <div className={`mode-badge ${booking.mode === "online" ? "mode-online" : "mode-offline"}`}>
                  {booking.mode === "online" ? "🖥️ Online" : "📍 Offline"}
                </div>

                {/* Price */}
                <div className="booking-price">
                  ₹ {booking.price?.toLocaleString('en-IN') || '0'}
                </div>

                {/* Action Button */}
                <button 
                  className="view-btn"
                  onClick={() => handleViewBooking(booking._id)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <BookingDetailsModal
          bookingId={selectedBookingId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default MyBookings;
