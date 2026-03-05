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
    coupons: stateCoupons,
    mode: pujaMode,
  } = location.state || {};

  // Support multiple coupons (array) and legacy single coupon
  const hasCoupons =
    (stateCoupons && stateCoupons.length > 0) || (coupon != null);

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

  const [appliedCoupon, setAppliedCoupon] = useState(location.state?.appliedCoupon ?? null);
  const [discountAmount, setDiscountAmount] = useState(location.state?.discountAmount ?? 0);
  const [finalAmount, setFinalAmount] = useState(location.state?.finalAmount ?? subtotal);
  const [couponError, setCouponError] = useState("");
  const [couponInput, setCouponInput] = useState(location.state?.couponInput ?? "");
  const [couponLoading, setCouponLoading] = useState(false);
  const [prasadam, setPrasadam] = useState(location.state?.prasadam ?? false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const couponApplied = appliedCoupon != null;
  const finalPayable = couponApplied ? finalAmount : Math.max(subtotal, 0);

  // Sync finalAmount when subtotal changes and no coupon applied
  useEffect(() => {
    if (!couponApplied) {
      setFinalAmount(subtotal);
      setDiscountAmount(0);
    }
  }, [subtotal, couponApplied]);

  /** Calculate discount from coupon: percentage = subtotal × value/100; fixed = flat amount. No maxDiscountAmount. */
  const calcCouponDiscount = (coupon, amt) => {
    if (!coupon) return 0;
    const type = (coupon.discountType || "").toLowerCase();
    const val = Number(coupon.discountValue) || 0;

    if (type === "percentage") {
      return (amt * val) / 100;
    }
    if (type === "fixed" || type === "amount") {
      return Math.min(val, amt);
    }
    return 0;
  };

  const handleApplyCoupon = async () => {
    setCouponError("");
    const entered = (couponInput || "").trim();
    if (!entered) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    const poojaId = puja?._id || puja?.id;
    if (!poojaId) {
      setCouponError("Puja details missing. Cannot validate coupon.");
      return;
    }

    try {
      setCouponLoading(true);
      const res = await axiosInstance.post("/pooja/validate-coupon", {
        poojaId,
        couponCode: entered,
        subtotal,
      });
      const data = res.data;

      if (data.success && data.valid === true) {
        const couponObj = data.coupon ?? { code: entered, ...data.coupon };
        setAppliedCoupon(couponObj);
        const correctDiscount = calcCouponDiscount(couponObj, subtotal);
        setDiscountAmount(correctDiscount);
        setFinalAmount(Math.max(subtotal - correctDiscount, 0));
        setCouponError("");
      } else {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setFinalAmount(subtotal);
        setCouponError(data.message || "Invalid or expired coupon code");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to validate coupon. Please try again.";
      setCouponError(message);
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setFinalAmount(subtotal);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setFinalAmount(subtotal);
    setCouponError("");
    setCouponInput("");
  };

  // ================= PARTICIPANT COUNT =================
  const getParticipantCount = () => {
    const name = selectedPackage?.name?.toLowerCase() || "";
    if (name.includes("individual")) return 1;
    if (name.includes("Joint Family")) return 6;
    if (name.includes("couple") || name.includes("partner") || name.includes("Two person")) return 2;
    if (name.includes("Family")) return 4;
    return 1;
  };

  const participantCount = getParticipantCount();

  // ================= DEVOTEE FORM =================
  const [form, setForm] = useState(
    location.state?.form ?? {
      name: "",
      email: "",
      phone: "",
      gotra: "",
      address: "",
    }
  );

  // ================= PARTICIPANTS =================
  const [participants, setParticipants] = useState(
    location.state?.participants ??
    Array.from({ length: participantCount }, () => ({
      name: "",
      gotra: "",
    }))
  );

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Enforce 10-digit numeric phone input live
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, phone: digitsOnly.slice(0, 10) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoToLogin = () => {
    const billingState = {
      ...location.state,
      form,
      participants,
      appliedCoupon,
      couponInput,
      discountAmount,
      finalAmount,
      prasadam,
    };
    sessionStorage.setItem("billingReturnState", JSON.stringify(billingState));
    setShowLoginModal(false);
    navigate("/login", { state: { returnTo: "/billing" } });
  };

  const handleParticipantChange = (index, field, value) => {
    const updated = [...participants];
    updated[index][field] = value;
    setParticipants(updated);
  };

  // ================= PAYMENT =================
  const handlePayment = async () => {
    if (!localStorage.getItem("token")) {
      setShowLoginModal(true);
      return;
    }
    // Validate required fields
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill Name, Phone Number, and Address");
      return;
    }

    // Phone: must be exactly 10 digits
    if (!/^\d{10}$/.test(form.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    // Email: if provided, must contain "@" in a basic valid pattern
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    const missingParticipantNames = participants
      .map((p, i) => (p.name?.trim() ? null : i + 1))
      .filter(Boolean);
    if (missingParticipantNames.length > 0) {
      alert(`Please enter Name for Participant ${missingParticipantNames.join(", ")}`);
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
        poojaId: puja._id || puja.id,
        mode: pujaMode || "online",

        coupon: appliedCoupon ?? coupon ?? null,
        couponCode: appliedCoupon?.code || coupon?.code || null,
        isCouponApplied: couponApplied,
        discountAmount: couponApplied ? discountAmount : 0,

        devoteeDetails: form,
        participants: participants,
        appliedCoupon: couponApplied && appliedCoupon ? appliedCoupon : null,

        grandTotal: finalPayable,
        selectedPackage,
        addonsTotal,

        ...(prasadam && { prasadam: true }),
      };

      console.log("🚀 Booking payload:", payload);

      const res = await axiosInstance.post("/bookings/booking", payload);

      console.log("✅ Booking response:", res.data);

      const orderId =
        res.data.razorpayOrderId || res.data.orderId || res.data.order_id;
      if (res.data.success && orderId) {
        loadRazorpay(orderId, finalPayable);
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
    console.log("🔑 Razorpay key:", razorpayKey, "| order_id:", orderId);

    if (!razorpayKey) {
      alert("Razorpay key missing. Check your .env file.");
      return;
    }
    if (!orderId || typeof orderId !== "string" || !orderId.startsWith("order_")) {
      console.error("Invalid order_id from backend:", orderId);
      alert("Invalid order from server. Please try again.");
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
            gotra: p.gotra || "",
          })),
          coupon: couponApplied && appliedCoupon ? appliedCoupon : (couponApplied && coupon ? coupon : null),
          couponCode: couponApplied && (appliedCoupon?.code || coupon?.code) ? (appliedCoupon?.code || coupon?.code) : null,
          isCouponApplied: couponApplied,
          discountAmount: couponApplied ? discountAmount : 0,
          poojaId: puja?._id || puja?.id,
          date:
            selectedPackage?.date ||
            puja?.date ||
            (puja?.eventDate
              ? new Date(puja.eventDate).toLocaleDateString("en-IN")
              : null),
          grandTotal: finalPayable,
          puja,
          selectedPackage,
          image: image || null,
          addons,
          addonsTotal,
          prasadam,
        };
        try {
          const confirmRes = await axiosInstance.post(
            "/bookings/booking/confirm-razorpay",
            payload,
            {
              withCredentials: true,
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          );

          // After booking is confirmed, ask Interakt service to send invoice via WhatsApp.
          // Frontend now builds the invoice PDF URL instead of using a Cloudinary URL.
          const finalOrderId =
            confirmRes?.data?.bookingId || confirmRes?.data?.orderId || orderId;
          if (finalOrderId) {
            const invoicePdfUrl = `https://api.shriaaum.com/api/invoice-pdf/${finalOrderId}`;

            await sendInvoiceToBackend({
              phone: form.phone,
              name: form.name,
              email: form.email || "",
              amount: finalPayable,
              orderId: finalOrderId,
              pdfUrl: invoicePdfUrl,
            });
          }

          const invoice = {
            devoteeDetails: payload.devoteeDetails,
            participants: payload.participants,
            pujaName: puja.title,
            pujaDate: payload.date,
            packageName: selectedPackage?.name,
            packagePrice: selectedPackage?.price,
            addons: addons || [],
            addonsTotal,
            coupon: payload.coupon,
            couponCode: payload.couponCode,
            discountAmount: payload.discountAmount || discountAmount,
            grandTotal: payload.grandTotal,
          };
          setInvoiceData(invoice);
          setShowInvoiceModal(true);
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

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      console.error("❌ Razorpay payment failed:", response.error);
      const msg = response.error?.description || response.error?.reason || "Payment failed.";
      if (response.error?.code === "BAD_REQUEST_ERROR" && msg.includes("id") && msg.includes("not exist")) {
        alert("Payment error: Razorpay key mismatch. Ensure REACT_APP_RAZORPAY_KEY_ID in .env matches your backend Razorpay key exactly. Restart the dev server after changing .env.");
      } else {
        alert(`Payment failed: ${msg}`);
      }
    });
    rzp.open();
  };

  const handleDownloadInvoice = () => {
    if (!invoiceData) return;

    const {
      devoteeDetails,
      participants,
      pujaName,
      pujaDate,
      packageName,
      packagePrice,
      addons,
      addonsTotal,
      coupon,
      couponCode,
      discountAmount,
      grandTotal,
    } = invoiceData;

    const participantRows =
      participants && participants.length
        ? participants
            .map(
              (p, index) =>
                `<tr>
                  <td style="padding:4px 8px;">${index + 1}</td>
                  <td style="padding:4px 8px;">${p.name || "-"}</td>
                  <td style="padding:4px 8px;">${p.gotra || "-"}</td>
                </tr>`
            )
            .join("")
        : `<tr><td colspan="3" style="padding:4px 8px;">No participants listed</td></tr>`;

    const addonsRows =
      addons && addons.length
        ? addons
            .map(
              (a, index) =>
                `<tr>
                  <td style="padding:4px 8px;">${index + 1}</td>
                  <td style="padding:4px 8px;">${a.name || "-"}</td>
                  <td style="padding:4px 8px; text-align:right;">${a.quantity || 1}</td>
                  <td style="padding:4px 8px; text-align:right;">${a.total || a.price || "-"}</td>
                </tr>`
            )
            .join("")
        : `<tr><td colspan="4" style="padding:4px 8px;">No add-ons selected</td></tr>`;

    const couponRow =
      coupon && couponCode
        ? `<p style="margin:4px 0;">Coupon: <strong>${couponCode}</strong> (Discount: ₹${discountAmount || 0})</p>`
        : `<p style="margin:4px 0;">Coupon: <strong>Not applied</strong></p>`;

    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>Invoice - ${pujaName}</title>
          <meta charset="UTF-8" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 24px; color: #111827; }
            h1, h2, h3 { margin: 0 0 8px; }
            .section { margin-bottom: 16px; }
            .section-title { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
            table { border-collapse: collapse; width: 100%; font-size: 13px; }
            th, td { border: 1px solid #e5e7eb; padding: 6px 8px; text-align: left; }
            th { background: #f3f4f6; }
          </style>
        </head>
        <body>
          <h1>Invoice</h1>
          <p style="margin:4px 0;">Puja: <strong>${pujaName}</strong></p>
          <p style="margin:4px 0;">Date: <strong>${pujaDate || "-"}</strong></p>

          <div class="section">
            <div class="section-title">Devotee Details</div>
            <p style="margin:4px 0;">Name: <strong>${devoteeDetails?.name || "-"}</strong></p>
            <p style="margin:4px 0;">Phone: <strong>${devoteeDetails?.phone || "-"}</strong></p>
            <p style="margin:4px 0;">Email: <strong>${devoteeDetails?.email || "-"}</strong></p>
            <p style="margin:4px 0;">Gotra: <strong>${devoteeDetails?.gotra || "-"}</strong></p>
            <p style="margin:4px 0;">Address: <strong>${devoteeDetails?.address || "-"}</strong></p>
          </div>

          <div class="section">
            <div class="section-title">Participants</div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Gotra</th>
                </tr>
              </thead>
              <tbody>
                ${participantRows}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Puja Package</div>
            <p style="margin:4px 0;">Package: <strong>${packageName || "-"}</strong></p>
            <p style="margin:4px 0;">Price: <strong>${packagePrice || "-"}</strong></p>
          </div>

          <div class="section">
            <div class="section-title">Add-ons</div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th style="text-align:right;">Qty</th>
                  <th style="text-align:right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${addonsRows}
              </tbody>
            </table>
            <p style="margin:6px 0; text-align:right;"><strong>Add-ons Total: ${addonsTotal || 0}</strong></p>
          </div>

          <div class="section">
            <div class="section-title">Coupon & Total</div>
            ${couponRow}
            <p style="margin:4px 0;">Grand Total: <strong>₹${grandTotal}</strong></p>
          </div>
        </body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
  };

  const handleCloseInvoice = () => {
    setShowInvoiceModal(false);
    navigate("/");
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

  // ================= SEND INVOICE PDF VIA WHATSAPP (backend helper) =================
  // Mirrors the onBillingSuccess snippet provided (Interakt PDF send)
  const sendInvoiceToBackend = async ({
    phone,
    name,
    email,
    amount,
    orderId,
    pdfUrl,
  }) => {
    if (!phone || !pdfUrl || !orderId) {
      console.warn("Skipping WhatsApp invoice send, missing data:", {
        phone,
        pdfUrl,
        orderId,
      });
      return;
    }

    try {
      const res = await axiosInstance.post("/send-pdf-whatsapp", {
        countryCode: "+91",
        phoneNumber: phone,
        pdfUrl: pdfUrl,
        fileName: "invoice.pdf",
        name,
        email: email || "",
        amount: amount != null ? `₹${amount}` : undefined,
        orderId,
      });

      const data = res.data;

      if (data.success) {
        console.log(
          "✅ Invoice sent to WhatsApp! Message ID:",
          data.messageId
        );
        alert("Invoice sent to your WhatsApp! 📄");
      } else {
        console.error("❌ Failed sending WhatsApp PDF:", data.message);
      }
    } catch (err) {
      console.error("❌ Error sending WhatsApp PDF:", err);
    }
  };

  return (
    <>
    {showLoginModal && (
      <div
        className="billing-login-modal-backdrop"
        onClick={() => setShowLoginModal(false)}
        onKeyDown={(e) => e.key === "Escape" && setShowLoginModal(false)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        <div className="billing-login-modal" onClick={(e) => e.stopPropagation()}>
          <h2 id="login-modal-title" className="billing-login-modal-title">Please login to proceed</h2>
          <p className="billing-login-modal-text">You need to be logged in to complete your puja booking.</p>
          <div className="billing-login-modal-actions">
            <button type="button" className="billing-login-modal-btn secondary" onClick={() => setShowLoginModal(false)}>
              Cancel
            </button>
            <button type="button" className="billing-login-modal-btn primary" onClick={handleGoToLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    )}
    {showInvoiceModal && invoiceData && (
      <div className="billing-invoice-backdrop">
        <div className="billing-invoice-modal">
          <h2 className="billing-invoice-title">Payment Successful</h2>
          <p className="billing-invoice-subtitle">
            Your puja has been booked successfully. You can download the invoice or close this window.
          </p>

          <div className="billing-invoice-section">
            <h3>Invoice Summary</h3>
            <p><strong>Puja:</strong> {invoiceData.pujaName}</p>
            <p><strong>Date:</strong> {invoiceData.pujaDate || "-"}</p>
            <p><strong>Package:</strong> {invoiceData.packageName} ({invoiceData.packagePrice})</p>
            <p><strong>Grand Total:</strong> ₹{invoiceData.grandTotal}</p>
          </div>

          <div className="billing-invoice-section">
            <h3>Devotee Details</h3>
            <p><strong>Name:</strong> {invoiceData.devoteeDetails?.name || "-"}</p>
            <p><strong>Phone:</strong> {invoiceData.devoteeDetails?.phone || "-"}</p>
            <p><strong>Email:</strong> {invoiceData.devoteeDetails?.email || "-"}</p>
          </div>

          <div className="billing-invoice-section billing-invoice-actions">
            <button
              type="button"
              className="billing-invoice-btn billing-invoice-btn-primary"
              onClick={handleDownloadInvoice}
            >
              Download Invoice
            </button>
            <button
              type="button"
              className="billing-invoice-btn billing-invoice-btn-secondary"
              onClick={handleCloseInvoice}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
    <div className="billing-container">
      {/* LEFT IMAGE + MESSAGE */}
      <div className="billing-left">
        <div className="billing-left-inner">
          <div className="billing-left-image-wrap">
            <img
              src={image || "https://via.placeholder.com/600x800"}
              alt={puja.title}
            />
          </div>
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

          {/* COUPON: user enters code; backend validates via validate-coupon API */}
          {hasCoupons && (
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
                      disabled={couponLoading}
                    />
                    <button
                      type="button"
                      className="billing-coupon-apply-btn"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                    >
                      {couponLoading ? "Checking…" : "Apply"}
                    </button>
                  </div>
                  {couponError && (
                    <p className="billing-coupon-error">{couponError}</p>
                  )}
                </>
              ) : (
                <div className="discount-row billing-coupon-applied">
                  <span>Coupon ({appliedCoupon?.code}) applied</span>
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

          {/* Prasadam option */}
          <label className="billing-prasadam-option">
            <input
              type="checkbox"
              checked={prasadam}
              onChange={(e) => setPrasadam(e.target.checked)}
            />
            <span>Prasadam (complimentary)</span>
          </label>

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
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number *"
            value={form.phone}
            onChange={handleChange}
            maxLength={10}
            pattern="\d{10}"
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
                placeholder="Name *"
                value={p.name}
                onChange={(e) =>
                  handleParticipantChange(index, "name", e.target.value)
                }
                required
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
          {loading ? "Processing..." : `Pay ₹${finalPayable}`}
        </button>
      </div>
    </div>
    <Footer />
  </>
  );
}

export default BillingPage;
