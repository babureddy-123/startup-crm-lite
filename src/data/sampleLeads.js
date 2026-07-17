/**
 * @typedef {Object} LeadNote
 * @property {string} id - Unique note ID.
 * @property {string} text - Content text.
 * @property {string} date - ISO date string.
 */

/**
 * @typedef {Object} Lead
 * @property {string} id - Unique identifier for the lead.
 * @property {string} name - Full contact name (e.g. Rajesh Kumar).
 * @property {string} company - Associated company name (e.g. Tata Motors).
 * @property {string} email - Email address.
 * @property {string} phone - Phone number.
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'} status - Pipeline progress status.
 * @property {'Website'|'Referral'|'LinkedIn'|'Cold Call'|'Email Campaign'|'Other'} source - Sourcing channel.
 * @property {number} value - Financial deal value.
 * @property {string} owner - Assigned account manager.
 * @property {LeadNote[]} notes - Note logs timeline array.
 * @property {string} createdAt - ISO created timestamp string.
 */

/**
 * An initial seed dataset containing 6 realistic Indian lead opportunity profiles.
 * Features varied pipeline stages (2 New, 1 Contacted, 1 Meeting Scheduled, 1 Won, 1 Lost, 1 Proposal Sent/or custom).
 *
 * @type {Lead[]}
 */
export const sampleLeads = [
  {
    id: 'lead-101',
    name: 'Rajesh Kumar',
    company: 'Tata Motors Ltd',
    email: 'rajesh.kumar@tatamotors.com',
    phone: '+91 98765 43210',
    status: 'New',
    source: 'Website',
    value: 85000,
    owner: 'Anish Reddy',
    notes: [
      { id: 'note-101a', text: 'Inquired about custom ERP analytics packages. High intent.', date: '2026-07-16T10:15:00Z' }
    ],
    createdAt: '2026-07-16T10:15:00Z'
  },
  {
    id: 'lead-102',
    name: 'Priyanka Sharma',
    company: 'Infosys Careers',
    email: 'p.sharma@infosys.com',
    phone: '+91 87654 32109',
    status: 'Contacted',
    source: 'LinkedIn',
    value: 42000,
    owner: 'Rohith Nair',
    notes: [
      { id: 'note-102a', text: 'Connected on LinkedIn. Sent introductory catalog slides.', date: '2026-07-15T14:30:00Z' }
    ],
    createdAt: '2026-07-15T12:00:00Z'
  },
  {
    id: 'lead-103',
    name: 'Amit Patel',
    company: 'Reliance Digital',
    email: 'amit.patel@reliance.co.in',
    phone: '+91 76543 21098',
    status: 'Meeting Scheduled',
    source: 'Referral',
    value: 95000,
    owner: 'Sarah Connor',
    notes: [
      { id: 'note-103a', text: 'Scheduled demonstration call for next Tuesday at 3 PM IST.', date: '2026-07-14T09:00:00Z' }
    ],
    createdAt: '2026-07-14T08:30:00Z'
  },
  {
    id: 'lead-104',
    name: 'Karan Johar',
    company: 'Dharma Media',
    email: 'karan@dharma.in',
    phone: '+91 65432 10987',
    status: 'Won',
    source: 'Cold Call',
    value: 120000,
    owner: 'Anish Reddy',
    notes: [
      { id: 'note-104a', text: 'Contract signed! Provisioned pipeline portal.', date: '2026-07-12T16:20:00Z' }
    ],
    createdAt: '2026-07-10T11:00:00Z'
  },
  {
    id: 'lead-105',
    name: 'Deepika Padukone',
    company: 'Ka Enterprises',
    email: 'deepika@kaenterprises.com',
    phone: '+91 54321 09876',
    status: 'Lost',
    source: 'Email Campaign',
    value: 25000,
    owner: 'Sarah Connor',
    notes: [
      { id: 'note-105a', text: 'Decided to continue using internal spreadsheet logs due to budget freeze.', date: '2026-07-09T10:00:00Z' }
    ],
    createdAt: '2026-07-08T09:00:00Z'
  },
  {
    id: 'lead-106',
    name: 'Vijay Chandrasekhar',
    company: 'Chennai Tech Hub',
    email: 'vijay.c@chennaitech.org',
    phone: '+91 43210 98765',
    status: 'New',
    source: 'Other',
    value: 30000,
    owner: 'Rohith Nair',
    notes: [],
    createdAt: '2026-07-17T06:12:00Z'
  }
];
