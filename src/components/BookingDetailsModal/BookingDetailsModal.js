import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../lib/instance";
import "./BookingDetailsModal.css";

function BookingDetailsModal({ bookingId, onClose }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookingDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/bookings/booking-details/${bookingId}`);
      
      console.log("📄 Booking details:", response.data);
      setBooking(response.data.bookingDetails);
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setError(err.response?.data?.message || "Failed to load booking details");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId, fetchBookingDetails]);

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#ffc107",
      panditAccepted: "#17a2b8",
      inProgress: "#28a745",
      completed: "#28a745",
      expired: "#dc3545",
      cancelled: "#6c757d",
      panditRejected: "#dc3545"
    };
    return colors[status] || "#6c757d";
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Close modal on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target.className === "modal-backdrop") {
      onClose();
    }
  };

  if (!bookingId) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        {/* Close Button */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {loading ? (
          <div className="modal-loading">
            <div className="spinner"></div>
            <p>Loading details...</p>
          </div>
        ) : error ? (
          <div className="modal-error">
            <p>❌ {error}</p>
            <button onClick={fetchBookingDetails}>Retry</button>
          </div>
        ) : booking ? (
          <div className="modal-body">
            {/* Header */}
            <div className="modal-header">
              <h2>{booking.pooja?.name || "Puja Booking"}</h2>
              <span 
                className="modal-status-badge"
                style={{ backgroundColor: getStatusColor(booking.status) }}
              >
                {booking.status}
              </span>
            </div>

            {/* Booking ID */}
            {/* <div className="booking-id">
              <span>Booking ID:</span>
              <code>{booking.bookingId}</code>
            </div> */}

            {/* Main Info Grid */}
            <div className="info-grid">
              {/* Date & Time */}
              <div className="info-card">
                <h3>📅 Date & Time</h3>
                <p className="info-value">{formatDate(booking.date)}</p>
                <p className="info-label">
                  {booking.slots[0]?.start} - {booking.slots[booking.slots.length - 1]?.end}
                </p>
                <p className="info-label">Duration: {booking.pooja?.duration}</p>
              </div>

              {/* Mode */}
              <div className="info-card">
                <h3>{booking.pooja?.mode === "online" ? "🖥️" : "📍"} Mode</h3>
                <p className="info-value">{booking.pooja?.mode}</p>
                {booking.pooja?.mode === "offline" && booking.location && (
                  <p className="info-label">{booking.location.address}</p>
                )}
              </div>

              {/* Price */}
              <div className="info-card">
                <h3>💰 Price</h3>
                <p className="info-value">₹{booking.payment?.amount?.toLocaleString('en-IN')}</p>
                <p className="info-label">Status: {booking.payment?.status}</p>
              </div>

              {/* Payment Details */}
              <div className="info-card">
                <h3>💳 Payment</h3>
                <p className="info-label">Order ID: {booking.payment?.orderId?.substring(0, 20)}...</p>
                <p className="info-label">Transaction: {booking.payment?.transactionId?.substring(0, 20)}...</p>
              </div>
            </div>

            {/* Pandit Details */}
            {booking.pandit && (
              <div className="section-card">
                <h3>👤 Pandit Details</h3>
                <div className="pandit-detail-row">
                  {booking.pandit.profileImage && (
                    <img 
                      src={booking.pandit.profileImage} 
                      alt={booking.pandit.name}
                      className="pandit-detail-avatar"
                    />
                  )}
                  <div>
                    <p className="pandit-detail-name">{booking.pandit.name}</p>
                    <p className="pandit-detail-info">
                      ⭐ {booking.pandit.rating} ({booking.pandit.reviewCount} reviews)
                    </p>
                    <p className="pandit-detail-info">
                      Experience: {booking.pandit.experience} years
                    </p>
                    {booking.pandit.verified && (
                      <span className="verified-badge">✓ Verified</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* User Details */}
            {booking.user && (
              <div className="section-card">
                <h3>👥 Devotee Details</h3>
                <div className="detail-row">
                  <span>Name:</span>
                  <span>{booking.user.name}</span>
                </div>
                <div className="detail-row">
                  <span>Mobile:</span>
                  <span>{booking.user.mobile}</span>
                </div>
                {booking.user.email && booking.user.email !== "N/A" && (
                  <div className="detail-row">
                    <span>Email:</span>
                    <span>{booking.user.email}</span>
                  </div>
                )}
              </div>
            )}

            {/* Online Session */}
            {booking.onlineSession && (
              <div className="section-card online-session">
                <h3>🎥 Online Session</h3>
                <p className="channel-name">Channel: {booking.onlineSession.channelName}</p>
                <button className="join-btn">Join Session</button>
              </div>
            )}

            {/* Timestamps */}
            <div className="timestamps">
              <p>Created: {new Date(booking.createdAt).toLocaleString()}</p>
              <p>Updated: {new Date(booking.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default BookingDetailsModal;