'use client';

import { useState, useEffect } from 'react';
import { CropListing } from '@/types/user';

interface MpesaPaymentModalProps {
  listing: CropListing;
  farmerName: string;
  farmerLocation: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function MpesaPaymentModal({
  listing,
  farmerName,
  farmerLocation,
  isOpen,
  onClose,
}: MpesaPaymentModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(false);

  // Calculate total price
  const totalPrice = quantity * listing.pricePerUnit;

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setPhoneNumber('');
      setQuantity(1);
      setError('');
      setSuccess(false);
      setTransactionId('');
      setCheckingStatus(false);
    }
  }, [isOpen]);

  // Validate Kenyan phone number
  const validatePhoneNumber = (phone: string): boolean => {
    // Remove spaces and special characters
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');

    // Valid formats: +254XXXXXXXXX, 254XXXXXXXXX, 07XXXXXXXX, 7XXXXXXXX
    const kenyanPhoneRegex = /^(\+?254|0)?[71]\d{8}$/;
    return kenyanPhoneRegex.test(cleaned);
  };

  // Format phone number for display
  const formatPhoneDisplay = (phone: string): string => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    if (cleaned.startsWith('+254')) {
      return cleaned;
    } else if (cleaned.startsWith('254')) {
      return '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
      return '+254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7')) {
      return '+254' + cleaned;
    }
    return phone;
  };

  // Check payment status
  const checkPaymentStatus = async (txnId: string) => {
    setCheckingStatus(true);
    try {
      const response = await fetch(`/api/mpesa/payment?transactionId=${txnId}`);
      const data = await response.json();

      if (data.status === 'SUCCESS') {
        setSuccess(true);
        setCheckingStatus(false);
        return true;
      } else if (data.status === 'FAILED') {
        setError('Payment failed. Please try again.');
        setCheckingStatus(false);
        return false;
      }

      // Still pending, check again
      return null;
    } catch (error) {
      console.error('Error checking payment status:', error);
      return null;
    }
  };

  // Poll payment status
  useEffect(() => {
    if (!transactionId || success || !checkingStatus) return;

    const interval = setInterval(async () => {
      const result = await checkPaymentStatus(transactionId);
      if (result !== null) {
        clearInterval(interval);
      }
    }, 3000); // Check every 3 seconds

    // Stop checking after 2 minutes
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setCheckingStatus(false);
    }, 120000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [transactionId, success, checkingStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid Kenyan phone number (e.g., +254712345678 or 0712345678)');
      return;
    }

    // Validate quantity
    if (quantity < 1 || quantity > listing.quantity) {
      setError(`Quantity must be between 1 and ${listing.quantity}`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/mpesa/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: listing.id,
          phoneNumber,
          quantity,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTransactionId(data.transactionId);
        setCheckingStatus(true);
        setError('');
        // Don't close modal - wait for payment confirmation
      } else {
        setError(data.error || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (success) {
      // Refresh the page to show updated listing
      window.location.reload();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-green-600">Buy with M-Pesa</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            disabled={loading || checkingStatus}
          >
            &times;
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-green-800">Payment Successful!</h3>
                <p className="text-sm text-green-700 mt-1">
                  Your payment has been confirmed. Please contact the farmer for delivery arrangements.
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Close
            </button>
          </div>
        )}

        {/* Checking Status */}
        {checkingStatus && !success && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mt-0.5"></div>
              <div>
                <h3 className="font-semibold text-blue-800">Awaiting confirmation...</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Please complete the payment on your phone. This may take a few moments.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {!success && !checkingStatus && (
          <>
            {/* Listing Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">{listing.cropName}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Price:</span> KSh {listing.pricePerUnit.toLocaleString()} per {listing.unit}
                </p>
                <p>
                  <span className="font-medium">Available:</span> {listing.quantity} {listing.unit}
                </p>
                <p>
                  <span className="font-medium">Farmer:</span> {farmerName}
                </p>
                <p>
                  <span className="font-medium">Location:</span> {farmerLocation}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  M-Pesa Phone Number *
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+254712345678 or 0712345678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter the phone number that will receive the STK Push prompt
                </p>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity ({listing.unit})
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  min={1}
                  max={listing.quantity}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  disabled={loading}
                />
              </div>

              {/* Total Price */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-600">
                    KSh {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Initiating Payment...
                  </span>
                ) : (
                  'Pay with M-Pesa'
                )}
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </form>

            {/* Info */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>How it works:</strong> You'll receive an M-Pesa prompt on your phone.
                Enter your M-Pesa PIN to complete the payment. The listing will be marked as sold
                once payment is confirmed.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
