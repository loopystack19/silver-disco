'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserRole } from '@/types/user';

// Kenya Counties
const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
  'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
  'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  phone?: string;
  location?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as UserRole | '',
    phone: '',
    location: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < 3) return 'Full name must be at least 3 characters';
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return undefined;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string): string | undefined => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) return 'Phone number is required';
    
    // Remove spaces and dashes
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    // Check if starts with +254 or 07
    const startsWithCountryCode = cleanPhone.startsWith('+254');
    const startsWithZero = cleanPhone.startsWith('07');
    
    if (!startsWithCountryCode && !startsWithZero) {
      return 'Phone must start with +254 or 07';
    }
    
    // Check if contains only numbers (after + sign)
    const numbersOnly = cleanPhone.replace('+', '');
    if (!/^\d+$/.test(numbersOnly)) {
      return 'Phone number must contain only numbers';
    }
    
    // Check length (10-13 digits)
    const phoneLength = numbersOnly.length;
    if (phoneLength < 10 || phoneLength > 13) {
      return 'Phone number must be 10-13 digits';
    }
    
    return undefined;
  };

  const validateLocation = (location: string): string | undefined => {
    if (!location) return 'County is required';
    if (!KENYA_COUNTIES.includes(location)) return 'Please select a valid county';
    return undefined;
  };

  const validateRole = (role: string): string | undefined => {
    if (!role) return 'Please select a role';
    return undefined;
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors: ValidationErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
      phone: validatePhone(formData.phone),
      location: validateLocation(formData.location),
      role: validateRole(formData.role),
    };

    setErrors(newErrors);
    
    // Check if form is valid
    const isFormValid = Object.values(newErrors).every(error => !error);
    setIsValid(isFormValid);
    
    return isFormValid;
  };

  // Validate on field change
  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleBlur = (field: string) => {
    setTouched(prev => new Set(prev).add(field));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mark all fields as touched
    setTouched(new Set(['name', 'email', 'password', 'confirmPassword', 'phone', 'location', 'role']));

    // Validate form
    if (!validateForm()) {
      setError('Please fix all validation errors before submitting');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
          phone: formData.phone.trim(),
          location: formData.location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setIsLoading(false);
        return;
      }

      // Redirect to verification page with email pre-filled
      router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const roles = [
    { value: 'farmer' as UserRole, label: 'Farmer', description: 'Sell crops and connect with buyers' },
    { value: 'learner' as UserRole, label: 'Learner', description: 'Access free courses and certifications' },
    { value: 'student' as UserRole, label: 'Job Seeker', description: 'Find jobs and internship opportunities' },
    { value: 'buyer' as UserRole, label: 'Buyer', description: 'Purchase crops from farmers' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Join UmojaHub</h1>
          <p className="text-gray-600">Create your account and start your journey</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert" aria-live="polite">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am a... <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, role: role.value });
                    handleBlur('role');
                  }}
                  className={`p-4 border-2 rounded-lg text-left transition ${
                    formData.role === role.value
                      ? 'border-green-600 bg-green-50'
                      : touched.has('role') && errors.role
                      ? 'border-red-300 hover:border-red-400'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  <div className="font-semibold text-gray-900 mb-1">{role.label}</div>
                  <div className="text-sm text-gray-600">{role.description}</div>
                </button>
              ))}
            </div>
            {touched.has('role') && errors.role && (
              <p className="mt-2 text-sm text-red-600" role="alert">{errors.role}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onBlur={() => handleBlur('name')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition ${
                touched.has('name') && errors.name
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="John Doe"
              aria-invalid={touched.has('name') && !!errors.name}
              aria-describedby={touched.has('name') && errors.name ? 'name-error' : undefined}
            />
            {touched.has('name') && errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onBlur={() => handleBlur('email')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition ${
                touched.has('email') && errors.email
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="your@email.com"
              aria-invalid={touched.has('email') && !!errors.email}
              aria-describedby={touched.has('email') && errors.email ? 'email-error' : undefined}
            />
            {touched.has('email') && errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">{errors.email}</p>
            )}
          </div>

          {/* Phone and County */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                onBlur={() => handleBlur('phone')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition ${
                  touched.has('phone') && errors.phone
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="+254712345678"
                aria-invalid={touched.has('phone') && !!errors.phone}
                aria-describedby={touched.has('phone') && errors.phone ? 'phone-error' : undefined}
              />
              {touched.has('phone') && errors.phone && (
                <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">{errors.phone}</p>
              )}
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                County <span className="text-red-500">*</span>
              </label>
              <select
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                onBlur={() => handleBlur('location')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition ${
                  touched.has('location') && errors.location
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
                aria-invalid={touched.has('location') && !!errors.location}
                aria-describedby={touched.has('location') && errors.location ? 'location-error' : undefined}
              >
                <option value="">Select County</option>
                {KENYA_COUNTIES.map((county) => (
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
              </select>
              {touched.has('location') && errors.location && (
                <p id="location-error" className="mt-1 text-sm text-red-600" role="alert">{errors.location}</p>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              onBlur={() => handleBlur('password')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition ${
                touched.has('password') && errors.password
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="••••••••"
              aria-invalid={touched.has('password') && !!errors.password}
              aria-describedby={touched.has('password') && errors.password ? 'password-error' : undefined}
            />
            {touched.has('password') && errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              onBlur={() => handleBlur('confirmPassword')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition ${
                touched.has('confirmPassword') && errors.confirmPassword
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="••••••••"
              aria-invalid={touched.has('confirmPassword') && !!errors.confirmPassword}
              aria-describedby={touched.has('confirmPassword') && errors.confirmPassword ? 'confirm-password-error' : undefined}
            />
            {touched.has('confirmPassword') && errors.confirmPassword && (
              <p id="confirm-password-error" className="mt-1 text-sm text-red-600" role="alert">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !isValid}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating your account...' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-green-600 font-semibold hover:text-green-700">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
