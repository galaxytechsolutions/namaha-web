import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../lib/instance";
import "./BookingDetailsModal.css";

function BookingDetailsModal({ bookingId, onClose }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoiceUrl, setInvoiceUrl] = useState(null);

  const fetchBookingDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/bookings/booking-details/${bookingId}`);
      console.log("📄 Booking details:", response.data);

      const apiBooking = response.data.booking;
      const apiDetails = response.data.bookingDetails;
      const details = apiDetails || apiBooking || response.data;

      setBooking(details);
      setInvoiceUrl(
        apiBooking?.invoicePdfUrl ||
          apiDetails?.invoicePdfUrl ||
          details?.invoicePdfUrl ||
          null
      );
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
    if (!dateStr) return "-";
    const parts = dateStr.split("/");
    if (parts.length !== 3) return dateStr;
    const [day, month, year] = parts;
    const date = new Date(year, month - 1, day);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
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

  const normalizedStatus =
    booking?.status?.charAt(0).toUpperCase() + booking?.status?.slice(1) || "";

  const displayOrderId =
    booking?.razorpayOrderId ||
    booking?.payment?.orderId ||
    booking?.payment?.order_id ||
    "-";

  const displayPaymentId =
    booking?.razorpayPaymentId ||
    booking?.payment?.transactionId ||
    booking?.payment?.paymentId ||
    "-";

  const displayPaymentStatus =
    booking?.paymentStatus || booking?.payment?.status || "-";

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
              <h2>
                {booking.bookingSnapshot?.puja?.title ||
                  booking.pooja?.name ||
                  booking.pooja?.title ||
                  "Puja Booking"}
              </h2>
              <span 
                className="modal-status-badge"
                style={{ backgroundColor: getStatusColor(booking.status) }}
              >
                {normalizedStatus}
              </span>
            </div>

            {/* Booking ID */}
            {/* <div className="booking-id">
              <span>Booking ID:</span>
              <code>{booking.bookingId}</code>
            </div> */}

            {/* Main Info Grid */}
            <div className="info-grid">
              {/* Puja & Date */}
              <div className="info-card">
                <h3>📅 Puja & Date</h3>
                <p className="info-value">{formatDate(booking.date)}</p>
                <p className="info-label">
                  {booking.bookingSnapshot?.puja?.templeName ||
                    booking.bookingSnapshot?.puja?.location}
                </p>
                <p className="info-label">
                  Mode:{" "}
                  {booking.bookingSnapshot?.puja?.mode ||
                    booking.pooja?.mode ||
                    "-"}
                </p>
              </div>

              {/* Package Details */}
              <div className="info-card">
                <h3>📦 Package</h3>
                <p className="info-value">
                  {booking.bookingSnapshot?.selectedPackage?.name || "-"}
                </p>
                <p className="info-label">
                  Price: ₹
                  {booking.bookingSnapshot?.selectedPackage?.price ??
                    booking.price}
                </p>
                {booking.bookingSnapshot?.selectedPackage?.persons && (
                  <p className="info-label">
                    Persons: {booking.bookingSnapshot.selectedPackage.persons}
                  </p>
                )}
              </div>

              {/* Price & Payment Status */}
              <div className="info-card">
                <h3>💰 Price</h3>
                <p className="info-value">
                  ₹
                  {(booking.bookingSnapshot?.grandTotal ?? booking.price)?.toLocaleString(
                    "en-IN"
                  )}
                </p>
                <p className="info-label">
                  Payment status: {displayPaymentStatus}
                </p>
              </div>

              {/* Payment Details */}
              <div className="info-card">
                <h3>💳 Payment</h3>
                <p className="info-label">
                  Order ID:{" "}
                  {displayOrderId}
                </p>
                <p className="info-label">
                  Payment ID:{" "}
                  {displayPaymentId}
                </p>
                <p className="info-label">
                  Status: {displayPaymentStatus}
                </p>
                {invoiceUrl && (
                  <p className="info-label">
                    <a
                      href={invoiceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Invoice PDF
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* Devotee Details */}
            {booking.devoteeDetails && (
              <div className="section-card">
                <h3>👥 Devotee Details</h3>
                <div className="detail-row">
                  <span>Name:</span>
                  <span>{booking.devoteeDetails.name}</span>
                </div>
                <div className="detail-row">
                  <span>Mobile:</span>
                  <span>{booking.devoteeDetails.phone}</span>
                </div>
                {booking.devoteeDetails.email && (
                  <div className="detail-row">
                    <span>Email:</span>
                    <span>{booking.devoteeDetails.email}</span>
                  </div>
                )}
                {booking.devoteeDetails.gotra && (
                  <div className="detail-row">
                    <span>Gotra:</span>
                    <span>{booking.devoteeDetails.gotra}</span>
                  </div>
                )}
                {booking.devoteeDetails.address && (
                  <div className="detail-row">
                    <span>Address:</span>
                    <span>{booking.devoteeDetails.address}</span>
                  </div>
                )}
              </div>
            )}

            {/* Participant Details */}
            {booking.participants && booking.participants.length > 0 && (
              <div className="section-card">
                <h3>🧑‍🤝‍🧑 Participant Details</h3>
                {booking.participants.map((p, index) => (
                  <div key={p._id || index} className="detail-row">
                    <span>
                      {index + 1}. {p.name || "-"}
                    </span>
                    <span>
                      {p.nakshatra && `Nakshatra: ${p.nakshatra} `}
                      {p.gotra && `| Gotra: ${p.gotra}`}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Puja Details */}
            {booking.bookingSnapshot?.puja && (
              <div className="section-card">
                <h3>🕉️ Puja Details</h3>
                <div className="detail-row">
                  <span>Temple:</span>
                  <span>{booking.bookingSnapshot.puja.templeName}</span>
                </div>
                <div className="detail-row">
                  <span>Date:</span>
                  <span>{booking.bookingSnapshot.puja.date}</span>
                </div>
                <div className="detail-row">
                  <span>Duration:</span>
                  <span>{booking.bookingSnapshot.puja.duration}</span>
                </div>
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