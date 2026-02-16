import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/instance";
import "./BillingPage.css";

function BillingPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Data from PujaDetail page
    const {
        puja,
        selectedPackage,
        slot,
        bookingDate,
        image
    } = location.state || {};

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        gotra: "",
        address: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ================= PAYMENT =================
    const handlePayment = async () => {
        if (!form.name || !form.phone) {
            alert("Please fill required fields");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                panditId: "6942677920c6344505bfb1c6",
                poojaId: puja.id,
                date: bookingDate,
                slots: [slot],
                mode: "online",

                devoteeDetails: form,

                location: {
                    lat: 17.385,
                    lng: 78.4867,
                    address: puja.location
                }
            };

            const res = await axiosInstance.post("/bookings/booking", payload);

            if (res.data.success && res.data.razorpayOrderId) {
                loadRazorpay(res.data.razorpayOrderId, res.data.amount);
            }

        } catch (err) {
            alert(err.response?.data?.message || "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    // ================= RAZORPAY =================
    const loadRazorpay = (orderId, amount) => {
        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            amount: amount * 100,
            currency: "INR",
            order_id: orderId,
            name: "Sri Mandir Puja",
            description: `${puja.title} - ${selectedPackage.name}`,

            prefill: {
                name: form.name,
                email: form.email,
                contact: form.phone
            },

            handler: function () {
                alert("Payment successful!");
                navigate("/my-bookings");
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    if (!puja) return <h2 style={{ textAlign: "center" }}>Invalid Access</h2>;

    return (


        <div className="billing-container">


            {/* LEFT IMAGE */}
            <div className="billing-left">
                <img
                    src={image || "https://thumbs.dreamstime.com/b/diya-puja-bell-themselves-set-unmistakable-context-major-celebration-veneration-hindu-culture-diya-puja-134807016.jpg"}
                    alt={puja.title}
                    />
        </div>

            {/* RIGHT CONTENT */}
            <div className="billing-right">

                <h2>Billing Details</h2>

                <div className="billing-summary">
                    <h3>{puja.title}</h3>
                    <p><b>Package:</b> {selectedPackage.name}</p>
                    <p><b>Amount:</b> ₹{selectedPackage.price}</p>
                    <p><b>Date:</b> {bookingDate}</p>
                    <p><b>Slot:</b> {}</p>
                </div>


                <div className="billing-form">
                    <input
                        name="name"
                        placeholder="Full Name *"
                        onChange={handleChange}
                    />

                    <input
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                    />

                    <input
                        name="phone"
                        placeholder="Phone Number *"
                        onChange={handleChange}
                    />

                    <input
                        name="gotra"
                        placeholder="Gotra (optional)"
                        onChange={handleChange}
                    />

                    <textarea
                        name="address"
                        placeholder="Address"
                        onChange={handleChange}
                    />
                </div>

                <button onClick={handlePayment} disabled={loading}>
                    {loading ? "Processing..." : `Pay ₹${selectedPackage.price}`}
                </button>

            </div>
        </div>
    );
}

export default BillingPage;
