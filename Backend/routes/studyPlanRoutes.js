import express from 'express';
import {
  generateStudyPlan,
  getMyPlans,
  getPlanById,
  markTopicComplete,
  deletePlan,
} from '../controllers/studyPlanController.js';
import protect from '../middleware/protect.js';

const router = express.Router();

router.post('/generate', protect, generateStudyPlan);
router.get('/', protect, getMyPlans);
router.get('/:id',protect, getPlanById);
router.patch('/:planId/topic/:topicIndex', protect, markTopicComplete);
router.delete('/:id',protect, deletePlan);

export default router;