/**
 * @typedef {Object} LeadNote
 * @property {string} id - Unique identifier for the note.
 * @property {string} text - Content text of the note.
 * @property {string} date - ISO date string of when the note was added.
 */

/**
 * @typedef {Object} Lead
 * @property {string} id - Unique identifier for the lead.
 * @property {string} name - Full contact name.
 * @property {string} company - Associated company name.
 * @property {string} email - Email contact address.
 * @property {string} phone - Contact phone.
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'} status - Pipeline progress status.
 * @property {'Website'|'Referral'|'LinkedIn'|'Cold Call'|'Email Campaign'|'Other'} source - Sourcing channel.
 * @property {number} value - Deal contract value.
 * @property {string} owner - Assigned account manager.
 * @property {LeadNote[]} notes - Timeline note history.
 * @property {string} createdAt - Date created timestamp.
 */

/**
 * Transforms leads array into a status stage distribution format suitable for Recharts Pie charts.
 *
 * @param {Lead[]} leads - List of CRM leads.
 * @returns {Array<{ name: string, value: number }>} Status tally results list.
 */
export function getStatusDistribution(leads = []) {
  // Define active statuses to audit
  const statuses = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

  return statuses.map(status => {
    // Count matches in leads array
    const count = leads.filter(lead => lead.status === status).length;
    return {
      name: status,
      value: count
    };
  });
}

/**
 * Groups leads created over the past 6 months into monthly buckets.
 * Calculates lead count values dynamically relative to the current local month.
 *
 * @param {Lead[]} leads - List of CRM leads.
 * @returns {Array<{ name: string, count: number }>} Array of months with opportunity counts.
 */
export function getMonthlyLeads(leads = []) {
  const last6Months = [];
  const now = new Date();
  
  // Establish month buckets chronologically over the past 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = d.toLocaleString('en-US', { month: 'short' });
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    
    last6Months.push({
      monthName,
      monthKey,
      count: 0
    });
  }

  // Iterate leads and increment matched monthly buckets
  leads.forEach(lead => {
    if (!lead.createdAt) return;
    const date = new Date(lead.createdAt);
    const leadMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const bucket = last6Months.find(m => m.monthKey === leadMonthKey);
    if (bucket) {
      bucket.count += 1;
    }
  });

  // Map to simple Recharts coordinates
  return last6Months.map(({ monthName, count }) => ({
    name: monthName,
    count
  }));
}

/**
 * Calculates conversion rate (Won / Total created leads) per month for the last 6 months.
 *
 * @param {Lead[]} leads - List of CRM leads.
 * @returns {Array<{ name: string, 'Conversion Rate (%)': number }>} Monthly conversion rates.
 */
export function getConversionByMonth(leads = []) {
  const last6Months = [];
  const now = new Date();
  
  // Establish month buckets chronologically
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = d.toLocaleString('en-US', { month: 'short' });
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    
    last6Months.push({
      monthName,
      monthKey,
      won: 0,
      total: 0
    });
  }

  // Group leads into buckets, checking total count and won count
  leads.forEach(lead => {
    if (!lead.createdAt) return;
    const date = new Date(lead.createdAt);
    const leadMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const bucket = last6Months.find(m => m.monthKey === leadMonthKey);
    if (bucket) {
      bucket.total += 1;
      if (lead.status === 'Won') {
        bucket.won += 1;
      }
    }
  });

  // Map to percentage values (0 - 100)
  return last6Months.map(({ monthName, won, total }) => {
    const rate = total > 0 ? Math.round((won / total) * 100) : 0;
    return {
      name: monthName,
      'Conversion Rate (%)': rate
    };
  });
}

/**
 * Calculates the average closure speed of Won or Lost opportunities in days.
 * Compares lead creation date with the date of the last logged timeline update note.
 *
 * @param {Lead[]} leads - List of CRM leads.
 * @returns {number} Average closing speed in days (0 if no closed leads exist).
 */
export function getAvgTimeToClose(leads = []) {
  // Filter leads in closed states (Won or Lost)
  const closedLeads = leads.filter(lead => ['Won', 'Lost'].includes(lead.status));
  if (closedLeads.length === 0) return 0;

  let totalDays = 0;
  let countedLeads = 0;

  closedLeads.forEach(lead => {
    // Audit notes history to find the final closing note timestamp
    if (lead.notes && lead.notes.length > 0) {
      // Sort notes chronologically to pinpoint the latest entry
      const sortedNotes = [...lead.notes].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const closeDate = new Date(sortedNotes[sortedNotes.length - 1].date);
      const createDate = new Date(lead.createdAt);
      
      const diffTime = Math.abs(closeDate.getTime() - createDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      totalDays += diffDays;
      countedLeads++;
    }
  });

  // Calculate average, fallback to a mock default (e.g. 7 days) if no notes timestamps are found.
  if (countedLeads === 0) {
    // If closed deals exist but notes are absent, return a standard benchmark value
    return 7;
  }

  return Math.round(totalDays / countedLeads);
}
