import React, { useState, useEffect } from 'react';
import { Sparkles, Save, X } from 'lucide-react';
// Import centralized constants
import { STATUS_OPTIONS, SOURCE_OPTIONS } from '../../constants';

/**
 * @typedef {Object} Lead
 * @property {string} [id] - Unique identifier for the lead (absent when creating a new lead).
 * @property {string} name - Full name of the lead contact.
 * @property {string} company - Lead company or organization name.
 * @property {string} email - Email contact address.
 * @property {string} phone - Contact phone number.
 * @property {string} status - Pipeline stage status.
 * @property {string} source - Referral source channel.
 * @property {number} value - Financial deal value.
 */

/**
 * @typedef {Object} LeadFormProps
 * @property {Lead} [initialData] - Optional lead object used to pre-fill inputs in Edit mode.
 * @property {function(Lead): void} onSubmit - Callback function executed upon successful form validation and submission.
 * @property {function(): void} onCancel - Callback function triggered when the user cancels the form action.
 */

/**
 * LeadForm component handles lead creation and modification.
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `bg-bg-base`, `border-border-subtle`, etc.) for themes.
 * Enforces touch-friendly heights of at least 44px on mobile via responsive py-3.
 *
 * @param {LeadFormProps} props - The component properties.
 * @returns {React.JSX.Element} Rendered form.
 */
export default function LeadForm({ initialData, onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('New');
  const [source, setSource] = useState('Website');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCompany(initialData.company || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setStatus(initialData.status || 'New');
      setSource(initialData.source || 'Website');
      setValue(initialData.value !== undefined ? String(initialData.value) : '');
      const rawNotes = initialData.notes;
      if (typeof rawNotes === 'string') {
        setNotes(rawNotes);
      } else if (Array.isArray(rawNotes) && rawNotes.length > 0) {
        setNotes(rawNotes[0].text || rawNotes[0] || '');
      } else {
        setNotes('');
      }
    } else {
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setStatus('New');
      setSource('Website');
      setValue('');
      setNotes('');
    }
    setErrors({});
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Contact name is required';
    }

    if (!company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (value && isNaN(Number(value))) {
      newErrors.value = 'Value must be a valid number';
    } else if (value && Number(value) < 0) {
      newErrors.value = 'Value cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formData = {
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        phone: phone.trim(),
        status,
        source,
        value: value ? Number(value) : 0,
        notes: notes.trim()
      };
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Modal/Form header details */}
      <div className="border-b border-border-subtle pb-4 mb-2 flex items-center justify-between transition-colors duration-200">
        <div>
          <h2 className="text-lg font-bold text-txt-main flex items-center gap-2">
            {initialData ? 'Modify CRM Lead' : 'Create New Lead'}
            {!initialData && <Sparkles className="w-4 h-4 text-primary" />}
          </h2>
          <p className="text-xs text-txt-sub">
            {initialData ? 'Update workspace parameters for this lead.' : 'Add a new client profile to the pipeline database.'}
          </p>
        </div>
      </div>

      {/* Grid wrapper for text field inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input 1: Contact Name */}
        <div className="flex flex-col">
          <label htmlFor="lead-name" className="text-xs font-semibold text-txt-main mb-1.5">
            Contact Name <span className="text-danger">*</span>
          </label>
          <input
            id="lead-name"
            type="text"
            placeholder="e.g. Sarah Jenkins"
            value={name}
            onChange={(e) => setName(e.target.value)}
            // Replaced hardcoded gray/white colors with theme tokens
            className={`w-full px-3.5 py-3 md:py-2 rounded-lg border text-sm bg-bg-base text-txt-main placeholder-txt-sub focus:outline-none transition-all ${
              errors.name
                ? 'border-danger focus:ring-1 focus:ring-danger'
                : 'border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary'
            }`}
          />
          {errors.name && <span className="text-[10px] font-medium text-danger mt-1">{errors.name}</span>}
        </div>

        {/* Input 2: Company Name */}
        <div className="flex flex-col">
          <label htmlFor="lead-company" className="text-xs font-semibold text-txt-main mb-1.5">
            Company Name <span className="text-danger">*</span>
          </label>
          <input
            id="lead-company"
            type="text"
            placeholder="e.g. Stripe Inc."
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={`w-full px-3.5 py-3 md:py-2 rounded-lg border text-sm bg-bg-base text-txt-main placeholder-txt-sub focus:outline-none transition-all ${
              errors.company
                ? 'border-danger focus:ring-1 focus:ring-danger'
                : 'border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary'
            }`}
          />
          {errors.company && <span className="text-[10px] font-medium text-danger mt-1">{errors.company}</span>}
        </div>

        {/* Input 3: Email Address */}
        <div className="flex flex-col">
          <label htmlFor="lead-email" className="text-xs font-semibold text-txt-main mb-1.5">
            Email Address <span className="text-danger">*</span>
          </label>
          <input
            id="lead-email"
            type="email"
            placeholder="e.g. sarah@stripe.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3.5 py-3 md:py-2 rounded-lg border text-sm bg-bg-base text-txt-main placeholder-txt-sub focus:outline-none transition-all ${
              errors.email
                ? 'border-danger focus:ring-1 focus:ring-danger'
                : 'border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary'
            }`}
          />
          {errors.email && <span className="text-[10px] font-medium text-danger mt-1">{errors.email}</span>}
        </div>

        {/* Input 4: Phone Number */}
        <div className="flex flex-col">
          <label htmlFor="lead-phone" className="text-xs font-semibold text-txt-main mb-1.5">
            Phone Number
          </label>
          <input
            id="lead-phone"
            type="tel"
            placeholder="e.g. +1 (555) 012-3456"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-3 md:py-2 border border-border-subtle text-sm bg-bg-base text-txt-main placeholder-txt-sub focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
          />
        </div>

        {/* Input 5: Pipeline Status */}
        <div className="flex flex-col">
          <label htmlFor="lead-status" className="text-xs font-semibold text-txt-main mb-1.5">
            Lead Status
          </label>
          <select
            id="lead-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3.5 py-3 md:py-2 rounded-lg border border-border-subtle text-sm bg-bg-base text-txt-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-surface-card text-txt-main">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Input 6: Lead Source */}
        <div className="flex flex-col">
          <label htmlFor="lead-source" className="text-xs font-semibold text-txt-main mb-1.5">
            Lead Source
          </label>
          <select
            id="lead-source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-3.5 py-3 md:py-2 rounded-lg border border-border-subtle text-sm bg-bg-base text-txt-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 cursor-pointer"
          >
            {SOURCE_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-surface-card text-txt-main">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Input 7: Contract Deal Value */}
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="lead-value" className="text-xs font-semibold text-txt-main mb-1.5">
            Deal Value ($ USD)
          </label>
          <input
            id="lead-value"
            type="text"
            placeholder="e.g. 45000"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={`w-full px-3.5 py-3 md:py-2 rounded-lg border text-sm bg-bg-base text-txt-main placeholder-txt-sub focus:outline-none transition-all ${
              errors.value
                ? 'border-danger focus:ring-1 focus:ring-danger'
                : 'border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary'
            }`}
          />
          {errors.value && <span className="text-[10px] font-medium text-danger mt-1">{errors.value}</span>}
        </div>

        {/* Input 8: Notes */}
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="lead-notes" className="text-xs font-semibold text-txt-main mb-1.5">
            Notes & Comments
          </label>
          <textarea
            id="lead-notes"
            rows="3"
            placeholder="Add background notes or interaction logs..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-border-subtle text-sm bg-bg-base text-txt-main placeholder-txt-sub focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
          />
        </div>
      </div>

      {/* Form Action Controls Section */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle mt-6 transition-colors duration-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-3 md:py-2 flex items-center gap-1.5 text-xs font-semibold rounded-lg text-txt-main bg-bg-base hover:bg-bg-base/80 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>Cancel</span>
        </button>

        <button
          type="submit"
          className="px-4 py-3 md:py-2 flex items-center gap-1.5 text-xs font-semibold rounded-lg text-white bg-primary hover:bg-primary/95 shadow-sm shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{initialData ? 'Update Lead' : 'Create Lead'}</span>
        </button>
      </div>
    </form>
  );
}
