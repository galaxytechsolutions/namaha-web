import React, { useState, useEffect } from "react";
import axiosInstance from "../../lib/instance";
import BookingDetailsModal from "../BookingDetailsModal/BookingDetailsModal";
import "./MyBooking.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get("/bookings/my-bookings", {
        params: {}
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
    const selectedPkg = b.bookingSnapshot?.selectedPackage ?? b.selectedPackage ?? b.package;
    const category = pujaObj?.category;
    const categoryName = typeof category === "object" ? category?.category ?? category?.name : null;
    return {
      id: b._id ?? b.id,
      name: pujaObj?.title ?? pujaObj?.name ?? "Puja Booking",
      packageName: selectedPkg?.name ?? categoryName ?? "N/A",
      date: b.date,
      slotStart: b.slots?.[0]?.start,
      duration: b.duration ?? selectedPkg?.duration ?? "—",
      price: b.price ?? b.bookingSnapshot?.grandTotal ?? b.grandTotal ?? b.payment?.amount ?? 0,
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
          <button onClick={fetchBookings}>Try Again</button>
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

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => {
            const d = getBookingDisplayData(booking);
            return (
              <div key={d.id || booking._id} className="booking-card">
                <div className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                  {getStatusText(booking.status)}
                </div>

                <div className="booking-content">
                  <h3 className="puja-name">{d.name}</h3>
                  <p className="puja-deity">Package: {d.packageName}</p>

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
