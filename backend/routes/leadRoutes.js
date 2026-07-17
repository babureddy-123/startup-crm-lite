import express from 'express';
import { 
  getLeads, 
  getLead,
  createLead, 
  updateLead, 
  updateLeadStatus, 
  deleteLead, 
  getLeadStats, 
  getMonthlyStats, 
  searchLeads 
} from '../controllers/leadController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Apply route protection middleware globally on all lead routes
router.use(protect);

// 1. Analytics & Autocomplete search paths (registered first to avoid parameter collision conflicts)
router.get('/stats/summary', getLeadStats);
router.get('/stats/monthly', getMonthlyStats);
router.get('/search', searchLeads);

// 2. Main Lead CRUD operational endpoints
router.get('/', getLeads);
router.post('/', createLead);
router.get('/:id', getLead);
router.put('/:id', updateLead);
router.patch('/:id/status', updateLeadStatus);
router.delete('/:id', deleteLead);

export default router;
