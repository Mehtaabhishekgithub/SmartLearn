import Groq from 'groq-sdk';
import StudyPlan from '../models/StudyPlan.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateStudyPlan = async (req, res) => {
  const { subject, days } = req.body;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
        messages: [
      {
        role: 'user',
        content: `Create a ${days}-day study plan for "${subject}".
        Return ONLY a JSON array like this, no extra text:
        [
          { "day": 1, "title": "Topic title", "description": "What to study" },
          { "day": 2, "title": "Topic title", "description": "What to study" }
        ]`,
      },
    ],
  });

  const text = response.choices[0].message.content;
  const cleaned = text.replace(/```json|```/g, '').trim();
  const topics = JSON.parse(cleaned);

  const plan = await StudyPlan.create({
    user: req.user._id,
    subject,
    topics,
  });

  res.status(201).json({ success: true, plan });
};

export const getMyPlans = async (req, res) => {
  const plans = await StudyPlan.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, plans });
};

export const getPlanById = async (req, res) => {
  const plan = await StudyPlan.findById(req.params.id);
  if (!plan) return res.status(404).json({ message: 'Plan not found' });
  res.json({ success: true, plan });
};

export const markTopicComplete = async (req, res) => {
  const { planId, topicIndex } = req.params;
  const plan = await StudyPlan.findById(planId);
  if (!plan) return res.status(404).json({ message: 'Plan not found' });
  plan.topics[topicIndex].completed = !plan.topics[topicIndex].completed;
  await plan.save();
  res.json({ success: true, plan });
};

export const deletePlan = async (req, res) => {
  await StudyPlan.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Plan deleted' });
};