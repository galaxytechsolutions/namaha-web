import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/instance";
import Footer from "../Footer/Footer";
import "./BillingPage.css";

function BillingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Always start Billing page at top (avoid opening scrolled down)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // ✅ Destructure values passed from PujaDetail navigate state (no pandit/slot/location)
  const {
    puja,
    selectedPackage,
    image,
    addons = [],
    addonsTotal = 0,
    grandTotal,
    coupon,
    mode: pujaMode,
    prasadam = false,
  } = location.state || {};

  const parseAmount = (value) => {
    if (!value) return 0;

    // remove ₹ , commas, spaces
    return Number(String(value).replace(/[₹,\s]/g, ""));
  };

  const packagePrice = parseAmount(selectedPackage?.price);
  const addonsPrice = parseAmount(addonsTotal);
  const passedGrandTotal = parseAmount(grandTotal);

  const subtotal =
    passedGrandTotal > 0 ? passedGrandTotal : packagePrice + addonsPrice;

  // Debug: confirm values arrived
  console.log("📦 BillingPage state received:", { pujaId: puja?.id, pujaTitle: puja?.title, selectedPackage });

  // ================= DATE PARSER =================
  const parseDDMMYYYY = (dateStr) => {
    if (!dateStr) return null;

    const [day, month, year] = dateStr.split("/");
    return new Date(year, month - 1, day);
  };

  const calculateDiscount = () => {
    if (!coupon || !coupon.isActive) return 0;

    const today = new Date();
    const expiry = parseDDMMYYYY(coupon.expiryDate);

    if (!expiry || expiry < today) return 0;

    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount = (subtotal * coupon.discountValue) / 100;

      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    }

    if (coupon.discountType === "flat") {
      discount = coupon.discountValue;
    }

    return Math.floor(discount);
  };

  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponInput, setCouponInput] = useState("");

  const discountAmount = couponApplied ? calculateDiscount() : 0;
  const finalPayable = Math.max(subtotal - discountAmount, 0);

  const handleApplyCoupon = () => {
    setCouponError("");
    if (!coupon) {
      setCouponError("No coupon available.");
      return;
    }

    const entered = (couponInput || "").trim();
    if (!entered) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    if (entered.toUpperCase() !== (coupon.code || "").trim().toUpperCase()) {
      setCouponError("Invalid coupon code.");
      setCouponApplied(false);
      return;
    }

    if (!coupon.isActive) {
      setCouponError("This coupon is not active.");
      return;
    }
    const expiry = parseDDMMYYYY(coupon.expiryDate);
    if (!expiry || expiry < new Date()) {
      setCouponError("This coupon has expired.");
      return;
    }
    setCouponApplied(true);
    setCouponError("");
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponError("");
    setCouponInput("");
  };

  // ================= PARTICIPANT COUNT =================
  const getParticipantCount = () => {
    const name = selectedPackage?.name?.toLowerCase() || "";
    if (name.includes("individual")) return 1;
    if (name.includes("partner")) return 2;
    if (name.includes("family") && !name.includes("joint")) return 4;
    if (name.includes("joint")) return 6;
    return 1;
  };

  const participantCount = getParticipantCount();

  // ================= DEVOTEE FORM =================
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gotra: "",
    address: "",
  });

  // ================= PARTICIPANTS =================
  const [participants, setParticipants] = useState(
    Array.from({ length: participantCount }, () => ({
      name: "",
      nakshatra: "",
      gotra: "",
    }))
  );

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleParticipantChange = (index, field, value) => {
    const updated = [...participants];
    updated[index][field] = value;
    setParticipants(updated);
  };

  // ================= PAYMENT =================
  const handlePayment = async () => {
    // Validate required fields
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill Name, Phone Number, and Address");
      return;
    }

    if (!puja?.id) {
      alert("Puja details missing. Please go back and try again.");
      navigate(-1);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        poojaId: puja.id,
        mode: pujaMode || "online",

        coupon,
        couponCode: coupon?.code || null,
        isCouponApplied: couponApplied,

        devoteeDetails: form,
        participants: participants,
        appliedCoupon: couponApplied && coupon ? coupon.code : null,

        ...(prasadam && { prasadam: true }),
      };

      console.log("🚀 Booking payload:", payload);

      const res = await axiosInstance.post("/bookings/booking", payload);

      console.log("✅ Booking response:", res.data);

      if (res.data.success && res.data.razorpayOrderId) {
        loadRazorpay(res.data.razorpayOrderId, finalPayable);
      } else {
        alert(res.data.message || "Failed to create order. Please try again.");
      }
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "Payment failed";

      console.error("❌ Payment error:", {
        status,
        message,
        data: err.response?.data,
      });

      if (status === 401) {
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      if (status === 409) {
        alert("Booking conflict. Please go back and try again.");
        navigate(-1);
        return;
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // ================= RAZORPAY =================
  const loadRazorpay = (orderId, amount) => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please refresh and try again.");
      return;
    }

    const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;

    // 🔍 Add this to debug
    console.log("🔑 Key being used:", razorpayKey);

    if (!razorpayKey) {
      alert("Razorpay key missing. Check your .env file.");
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: amount * 100, // ✅ paise
      currency: "INR",
      order_id: orderId,
      name: "Shri aaum Puja",
      description: `${puja.title} - ${selectedPackage.name}`,

      prefill: {
        name: form.name,
        email: form.email || "",
        contact: form.phone,
      },

      theme: { color: "#f96b26" },

      // POST /api/bookings/booking/confirm-razorpay — call after user completes Razorpay.
      // Full URL = baseURL + "/bookings/booking/confirm-razorpay" (e.g. https://developapi.shriaaum.com/api/bookings/booking/confirm-razorpay)
      handler: async function (response) {
        console.log("✅ Razorpay payment success:", response);
        const token = localStorage.getItem("token");
        const payload = {
          razorpay_order_id: orderId,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          devoteeDetails: {
            name: form.name,
            email: form.email || "",
            phone: form.phone,
            gotra: form.gotra || "",
            address: form.address || "",
          },
          participants: participants.map((p) => ({
            name: p.name || "",
            nakshatra: p.nakshatra || "",
            gotra: p.gotra || "",
          })),
          coupon: couponApplied && coupon ? coupon : null,
          couponCode: couponApplied && coupon ? coupon.code : null,
          isCouponApplied: couponApplied,
          discountAmount,
          poojaId: puja?._id || puja?.id,
          date: selectedPackage?.date || null,
          grandTotal: finalPayable,
          puja,
          selectedPackage,
          addons,
          addonsTotal,
          prasadam,
        };
        try {
          await axiosInstance.post(
            "/bookings/booking/confirm-razorpay",
            payload,
            {
              withCredentials: true,
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          );
          alert("🎉 Payment successful! Your puja has been booked.");
          navigate("/");
        } catch (err) {
          console.error("Confirm payment error:", err);
          alert(err.response?.data?.message || "Failed to confirm booking. Please contact support.");
        }
      },

      modal: {
        ondismiss: function () {
          console.log("Payment modal closed by user");
        },
      },
    };

    console.log("💳 Opening Razorpay with:", {
      orderId,
      amount: amount * 100,
      key: options.key ? "SET" : "MISSING ⚠️",
    });

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Guard: if accessed directly without state
  if (!puja) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Invalid Access</h2>
        <p>Please go back and select a puja first.</p>
        <button onClick={() => navigate("/puja")}>Back to Puja List</button>
      </div>
    );
  }

  return (
    <>
    <div className="billing-container">
      {/* LEFT IMAGE + MESSAGE */}
      <div className="billing-left">
        <div className="billing-left-inner">
          <img
            src={image || "https://via.placeholder.com/600x800"}
            alt={puja.title}
          />
          <div className="billing-left-message">
            <p className="billing-left-message-title">You're almost there!</p>
            <p className="billing-left-message-text">
              Complete your details on the right and proceed to payment to confirm your sacred puja booking.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="billing-right">
        <h2>Billing Details</h2>

        {/* SUMMARY */}
        {/* SUMMARY */}
        <div className="billing-summary">
          <h3>{puja.title}</h3>
          <p>
            <b>Package:</b> {selectedPackage.name}
          </p>
          <p>
            <b>Package Amount:</b> {selectedPackage.price}
          </p>

          {/* ✅ ADDONS SUMMARY */}
          {addons && addons.length > 0 && (
            <div className="addons-summary">
              <h4>Add-ons ({addons.length})</h4>
              {addons.map((addon, index) => (
                <div key={addon.id || index} className="addon-row">
                  <span>
                    {addon.name} × {addon.quantity}
                  </span>
                  <span className="addon-price">{addon.total}</span>
                </div>
              ))}
              <div className="addons-total-row">
                <span className="addons-total-label">Addons Total:</span>
                <span className="addons-total-price">{addonsTotal}</span>
              </div>
            </div>
          )}

          {/* COUPON: user enters code; discount only if matches and is valid */}
          {coupon && (
            <div className="billing-coupon-section">
              {!couponApplied ? (
                <>
                  <div className="billing-coupon-row">
                    <span className="billing-coupon-label">Coupon:</span>
                    <input
                      type="text"
                      className="billing-coupon-input"
                      placeholder="Enter coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className="billing-coupon-apply-btn"
                      onClick={handleApplyCoupon}
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="billing-coupon-error">{couponError}</p>
                  )}
                </>
              ) : (
                <div className="discount-row billing-coupon-applied">
                  <span>Coupon ({coupon.code}) applied</span>
                  <span className="discount-price">- ₹{discountAmount}</span>
                  <button
                    type="button"
                    className="billing-coupon-remove"
                    onClick={handleRemoveCoupon}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ✅ GRAND TOTAL */}
          <div className="grand-total-row">
            <span className="grand-total-label">Grand Total:</span>
            <span className="grand-total-price">₹{finalPayable}</span>
          </div>
        </div>

        {/* DEVOTEE FORM */}
        <div className="billing-form">
          <input
            name="name"
            placeholder="Full Name *"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="phone"
            placeholder="Phone Number *"
            value={form.phone}
            onChange={handleChange}
          />
          <input
            name="gotra"
            placeholder="Gotra"
            value={form.gotra}
            onChange={handleChange}
          />
          <textarea
            name="address"
            placeholder="Address *"
            value={form.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* PARTICIPANTS */}
        <div className="participants-section">
          <h3>Participant Details</h3>

          {participants.map((p, index) => (
            <div key={index} className="participant-card">
              <h4>Participant {index + 1}</h4>

              <input
                placeholder="Name"
                value={p.name}
                onChange={(e) =>
                  handleParticipantChange(index, "name", e.target.value)
                }
              />
              <input
                placeholder="Nakshatra"
                value={p.nakshatra}
                onChange={(e) =>
                  handleParticipantChange(index, "nakshatra", e.target.value)
                }
              />
              <input
                placeholder="Gotra"
                value={p.gotra}
                onChange={(e) =>
                  handleParticipantChange(index, "gotra", e.target.value)
                }
              />
            </div>
          ))}
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="pay-button"
        >
          {loading ? "Processing..." : `Pay ₹${finalPayable.toFixed(0)}`}
        </button>
      </div>
    </div>
    <Footer />
  </>
  );
}

export default BillingPage;
