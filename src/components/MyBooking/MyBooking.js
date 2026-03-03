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

      const data = response.data;
      const list = data?.bookings ?? data?.data ?? (Array.isArray(data) ? data : []);
      console.log("📋 Bookings data:", list);
      setBookings(Array.isArray(list) ? list : []);
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
    if (!dateStr) return "—";
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getBookingDisplayData = (b) => {
    const pooja = b.poojaId ?? b.pooja;
    const pujaObj = typeof pooja === "object" ? pooja : null;
    const selectedPkg = b.selectedPackage ?? b.package;
    return {
      id: b._id ?? b.id,
      name: pujaObj?.title ?? pujaObj?.name ?? "Puja Booking",
      deity: pujaObj?.category ?? pujaObj?.section ?? selectedPkg?.name ?? "N/A",
      pandit: b.panditId ?? b.pandit,
      date: b.date,
      slotStart: b.slots?.[0]?.start,
      duration: b.duration ?? selectedPkg?.duration ?? "—",
      price: b.price ?? b.grandTotal ?? b.payment?.amount ?? 0,
      mode: b.mode ?? "online",
    };
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
          {bookings.map((booking) => {
            const d = getBookingDisplayData(booking);
            const pandit = d.pandit && typeof d.pandit === "object" ? d.pandit : null;
            const imgUrl = pandit?.profileImage?.url ?? pandit?.profileImage;
            return (
              <div key={d.id || booking._id} className="booking-card">
                <div className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                  {getStatusText(booking.status)}
                </div>

                <div className="booking-content">
                  <h3 className="puja-name">{d.name}</h3>
                  <p className="puja-deity">Package: {d.deity}</p>

                  <div className="pandit-info">
                    <div className="pandit-avatar">
                      {imgUrl ? (
                        <img src={imgUrl} alt={pandit?.name ?? "Pandit"} />
                      ) : (
                        <div className="avatar-placeholder">
                          {pandit?.name?.charAt(0) ?? "P"}
                        </div>
                      )}
                    </div>
                    <div className="pandit-details">
                      <span className="pandit-name">
                        👤 {pandit?.name ?? "To be assigned"}
                      </span>
                      {pandit?.rating && (
                        <span className="pandit-rating">⭐ {pandit.rating}</span>
                      )}
                    </div>
                  </div>

                  <div className="booking-datetime">
                    <div className="datetime-item">
                      <span className="icon">📅</span>
                      <span>{formatDate(d.date)}</span>
                    </div>
                    {d.slotStart && (
                      <div className="datetime-item">
                        <span className="icon">🕐</span>
                        <span>{d.slotStart}</span>
                      </div>
                    )}
                    {d.duration && d.duration !== "—" && (
                      <div className="datetime-item">
                        <span className="icon">⏱️</span>
                        <span>{d.duration}</span>
                      </div>
                    )}
                  </div>

                  <div className={`mode-badge ${d.mode === "online" ? "mode-online" : "mode-offline"}`}>
                    {d.mode === "online" ? "🖥️ Online" : "📍 Offline"}
                  </div>

                  <div className="booking-price">
                    ₹ {Number(d.price).toLocaleString("en-IN")}
                  </div>

                  <button
                    className="view-btn"
                    onClick={() => handleViewBooking(d.id || booking._id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
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
