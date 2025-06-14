// frontend/src/pages/ReturnPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';

const ReturnPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found in URL.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/session-status?session_id=${sessionId}`) // Ensure this URL is correct
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching session status:", err);
        setError("Failed to load payment status. Please try again or contact support.");
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading payment status...</p>
        {/* Add a spinner here */}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h1>Error</h1>
        <p>{error}</p>
        <p><a href="/checkout">Try again</a></p>
      </div>
    );
  }

  if (status === 'open') {
    // If session is still open, redirect back to checkout
    return <Navigate to="/checkout" replace />;
  }

  if (status === 'complete') {
    return (
      <section id="success" style={{ padding: '20px', textAlign: 'center', backgroundColor: '#e9f7ef', borderRadius: '8px' }}>
        <h1 style={{ color: '#28a745' }}>🎉 Donation Successful! 🎉</h1>
        <p>
          We appreciate your business! A confirmation email will be sent to <strong>{customerEmail}</strong>.
          <br/><br/>
          If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
        <p style={{ marginTop: '30px' }}>
          <a href="/checkout" style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Make another donation</a>
        </p>
      </section>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Payment Status: {status}</h1>
      <p>Unknown or pending status.</p>
    </div>
  );
};

export default ReturnPage;