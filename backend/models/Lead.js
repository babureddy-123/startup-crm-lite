import mongoose from 'mongoose';

/**
 * Lead Schema definition for tracking opportunities and pipeline stages.
 */
const LeadSchema = new mongoose.Schema(
  {
    /**
     * Lead contact person's full name.
     */
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    /**
     * Lead's employer company or entity name.
     */
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    /**
     * Lead's email contact address. Checked with regex format validator.
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Email must be a valid email address'
      ]
    },
    /**
     * Optional telephone contact number for the lead.
     */
    phone: {
      type: String,
      trim: true
    },
    /**
     * Current workflow pipeline status of the lead.
     * Matches exact frontend values: New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost.
     */
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'],
        message: 'Status must be one of: New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost'
      },
      default: 'New'
    },
    /**
     * Acquisition source channel where the lead was generated.
     * Matches exact frontend values: Website, Referral, LinkedIn, Cold Call, Email Campaign, Other.
     */
    source: {
      type: String,
      enum: {
        values: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'],
        message: 'Source must be one of: Website, Referral, LinkedIn, Cold Call, Email Campaign, Other'
      },
      default: 'Website'
    },
    /**
     * Optional background info log or interaction notes. Max 1000 characters.
     */
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    /**
     * Reference to the User owner who created and manages the lead profile.
     */
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead owner is required']
    }
  },
  {
    timestamps: true,
    // Enable virtual fields to serialize into JSON and objects automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Virtual property calculating lead age in days since the creation timestamp.
 */
LeadSchema.virtual('age').get(function () {
  if (!this.createdAt) return 0;
  const now = new Date();
  const createdDate = new Date(this.createdAt);
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// INDEX OPTIMIZATIONS:

// 1. Compound index on (owner, status) for high-performance dashboard status queries
LeadSchema.index({ owner: 1, status: 1 });

// 2. Compound index on (owner, createdAt) for high-performance sorted list queries
LeadSchema.index({ owner: 1, createdAt: -1 });

// 3. Compound index on (owner, source) for high-performance sourcing statistics facets
LeadSchema.index({ owner: 1, source: 1 });

// 4. Lookup index on email for quick validation checks
LeadSchema.index({ email: 1 });

const Lead = mongoose.model('Lead', LeadSchema);

export { LeadSchema };
export default Lead;
