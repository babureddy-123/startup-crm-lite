import mongoose from 'mongoose';
import Lead from '../models/Lead.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Enhanced list querying for leads with dynamic filters, sorting, and pagination.
 *
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Express error forwarder.
 * @returns {Promise<void>}
 */
export async function getLeads(req, res, next) {
  const {
    page = 1,
    limit = 1000,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    status,
    search,
    source,
    dateFrom,
    dateTo
  } = req.query;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 1000;
  const skip = (pageNum - 1) * limitNum;

  // Build dynamic search filter criteria
  const filter = { owner: req.user._id };

  if (status) {
    filter.status = status;
  }

  if (source) {
    filter.source = source;
  }

  // Handle date-range filters on createdAt timestamp
  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) {
      filter.createdAt.$gte = new Date(dateFrom);
    }
    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = endDate;
    }
  }

  // Handle case-insensitive keyword search
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const sortVal = sortOrder === 'desc' ? -1 : 1;
    const leads = await Lead.find(filter)
      .sort({ [sortBy]: sortVal })
      .skip(skip)
      .limit(limitNum);

    const total = await Lead.countDocuments(filter);
    const pages = Math.ceil(total / limitNum) || 1;

    return res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages,
        hasNext: pageNum < pages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Fetches a single lead document by ID.
 *
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Express error forwarder.
 * @returns {Promise<void>}
 */
export async function getLead(req, res, next) {
  const { id } = req.params;

  try {
    const lead = await Lead.findOne({ _id: id, owner: req.user._id });
    if (!lead) {
      return errorResponse(res, 'Lead not found or unauthorized', 404);
    }
    return successResponse(res, lead, 'Lead fetched successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Creates a new lead document.
 * Sets the owner automatically to the active authenticated user session.
 *
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Express error forwarder.
 * @returns {Promise<void>}
 */
export async function createLead(req, res, next) {
  const { name, company, email, phone, status, source, notes } = req.body;

  try {
    const lead = await Lead.create({
      name,
      company,
      email,
      phone,
      status,
      source,
      notes,
      owner: req.user._id
    });

    return successResponse(res, lead, 'Lead created successfully', 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Updates an existing lead by ID.
 *
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Express error forwarder.
 * @returns {Promise<void>}
 */
export async function updateLead(req, res, next) {
  const { id } = req.params;
  const { name, company, email, phone, status, source, notes } = req.body;

  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { name, company, email, phone, status, source, notes },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return errorResponse(res, 'Lead not found or unauthorized', 404);
    }

    return successResponse(res, lead, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Quick status patches for leads.
 *
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Express error forwarder.
 * @returns {Promise<void>}
 */
export async function updateLeadStatus(req, res, next) {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return errorResponse(res, 'Lead not found or unauthorized', 404);
    }

    return successResponse(res, lead, 'Lead status updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes a lead by ID.
 *
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Express error forwarder.
 * @returns {Promise<void>}
 */
export async function deleteLead(req, res, next) {
  const { id } = req.params;

  try {
    const lead = await Lead.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!lead) {
      return errorResponse(res, 'Lead not found or unauthorized', 404);
    }

    return successResponse(res, null, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Generates aggregated lead pipeline statistics in a single query.
 *
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Express error forwarder.
 * @returns {Promise<void>}
 */
export async function getLeadStats(req, res, next) {
  const ownerId = new mongoose.Types.ObjectId(req.user._id);

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  try {
    const aggregationResult = await Lead.aggregate([
      // Match by owner index
      { $match: { owner: ownerId } },
      
      // Compute multiple facets in a single DB query
      {
        $facet: {
          totalCount: [{ $count: 'count' }],
          statusCounts: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          sourceCounts: [
            { $group: { _id: '$source', count: { $sum: 1 } } }
          ],
          thisMonthCount: [
            { $match: { createdAt: { $gte: startOfThisMonth } } },
            { $count: 'count' }
          ],
          lastMonthCount: [
            { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
            { $count: 'count' }
          ]
        }
      }
    ]);

    const result = aggregationResult[0] || {};
    const totalLeads = result.totalCount?.[0]?.count || 0;
    const thisMonthLeads = result.thisMonthCount?.[0]?.count || 0;
    const lastMonthLeads = result.lastMonthCount?.[0]?.count || 0;

    // Build status breakdown mappings
    const statusBreakdown = {
      'New': 0, 'Contacted': 0, 'Meeting Scheduled': 0, 'Proposal Sent': 0, 'Won': 0, 'Lost': 0
    };
    if (result.statusCounts) {
      result.statusCounts.forEach(item => {
        if (item._id) statusBreakdown[item._id] = item.count;
      });
    }

    // Build source breakdown mappings
    const sourceBreakdown = {
      'Website': 0, 'Referral': 0, 'LinkedIn': 0, 'Cold Call': 0, 'Email Campaign': 0, 'Other': 0
    };
    if (result.sourceCounts) {
      result.sourceCounts.forEach(item => {
        if (item._id) sourceBreakdown[item._id] = item.count;
      });
    }

    // Compute conversion rate based on Won vs Total closed deals
    const wonCount = statusBreakdown['Won'] || 0;
    const lostCount = statusBreakdown['Lost'] || 0;
    const closedCount = wonCount + lostCount;
    const conversionRate = closedCount > 0 
      ? parseFloat(((wonCount / closedCount) * 100).toFixed(1)) 
      : 0;

    // Compute month-over-month growth rate
    let growthRate = 0;
    if (lastMonthLeads > 0) {
      growthRate = parseFloat((((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100).toFixed(1));
    } else if (thisMonthLeads > 0) {
      growthRate = 100; // 100% growth if prev month was empty and current has inflows
    }

    return successResponse(res, {
      totalLeads,
      statusBreakdown,
      conversionRate,
      sourceBreakdown,
      thisMonthLeads,
      lastMonthLeads,
      growthRate
    }, 'Lead summary statistics generated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieves monthly leads creation totals and conversion trends for the last 6 months.
 *
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Express error forwarder.
 * @returns {Promise<void>}
 */
export async function getMonthlyStats(req, res, next) {
  const ownerId = new mongoose.Types.ObjectId(req.user._id);

  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  try {
    const monthlyStats = await Lead.aggregate([
      // Filter by owner and within the last 6 months range
      { 
        $match: { 
          owner: ownerId,
          createdAt: { $gte: sixMonthsAgo } 
        } 
      },
      
      // Group by year and month
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: 1 },
          won: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } },
          lost: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } }
        }
      }
    ]);

    // JavaScript Post-processing to fill in 6-month sequence correctly (handling empty month gaps)
    const monthsData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      monthsData.push({
        month: monthLabel,
        yearNum: d.getFullYear(),
        monthNum: d.getMonth() + 1, // 1-indexed for MongoDB matching
        total: 0,
        won: 0,
        lost: 0,
        conversionRate: 0
      });
    }

    // Map Mongoose aggregations to months array
    monthlyStats.forEach(item => {
      const bucket = monthsData.find(b => b.yearNum === item._id.year && b.monthNum === item._id.month);
      if (bucket) {
        bucket.total = item.total;
        bucket.won = item.won;
        bucket.lost = item.lost;
        const closed = item.won + item.lost;
        bucket.conversionRate = closed > 0 ? parseFloat(((item.won / closed) * 100).toFixed(1)) : 0;
      }
    });

    // Remove internal mapping properties before response
    const finalData = monthsData.map(({ month, total, won, lost, conversionRate }) => ({
      month,
      total,
      won,
      lost,
      conversionRate
    }));

    return successResponse(res, finalData, 'Monthly leads statistics generated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Autocomplete leads search endpoint.
 * Returns brief details (name, company, email, status).
 *
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Express error forwarder.
 * @returns {Promise<void>}
 */
export async function searchLeads(req, res, next) {
  const { q = '', limit = 5 } = req.query;
  const limitNum = parseInt(limit, 10) || 5;

  try {
    const searchFilter = { owner: req.user._id };

    if (q) {
      searchFilter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }

    const leads = await Lead.find(searchFilter)
      .select('_id name company email status')
      .limit(limitNum);

    return successResponse(res, leads, 'Search autocomplete results fetched');
  } catch (error) {
    next(error);
  }
}
