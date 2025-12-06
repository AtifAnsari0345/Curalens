import express from 'express';
import Medicine from '../models/Medicine.js';
import { protect } from '../middleware/authMiddleware.js';
import { searchRealMedicineData, searchSimilarMedicines } from '../services/realMedicineApi.js';

const router = express.Router();

// Real medicine API integration - no mock data needed

// @desc    Search for medicine information by name using real APIs
// @route   GET /api/medicines/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ message: 'Please provide a medicine name' });
    }
    
    console.log(`Searching for medicine: ${name}`);
    
    // Search using real medicine APIs (RxNorm, OpenFDA, NIH)
    const medicineInfo = await searchRealMedicineData(name);
    
    if (medicineInfo) {
      console.log(`Found medicine: ${medicineInfo.name} from ${medicineInfo.source}`);
      res.json(medicineInfo);
    } else {
      // Try to find similar medicines for suggestions
      const suggestions = await searchSimilarMedicines(name);
      
      const response = {
        message: `No information found for "${name}".`,
        suggestions: suggestions.length > 0 ? suggestions : null
      };
      
      if (suggestions.length > 0) {
        response.message += ` Did you mean: ${suggestions.slice(0, 3).join(', ')}?`;
      }
      
      res.status(404).json(response);
    }
  } catch (error) {
    console.error('Medicine search error:', error);
    res.status(500).json({ 
      message: 'Server error while searching for medicine. Please try again.' 
    });
  }
});

// @desc    Get all medicines for a user
// @route   GET /api/medicines
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.user._id });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new medicine
// @route   POST /api/medicines
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, dose, times, details } = req.body;

    const medicine = await Medicine.create({
      name,
      dose,
      times,
      details,
      userId: req.user._id
    });

    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update medicine details
// @route   PUT /api/medicines/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Check if medicine belongs to user
    if (medicine.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedMedicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Toggle medicine acceptance
// @route   PUT /api/medicines/:id/toggle-accept
// @access  Private
router.put('/:id/toggle-accept', protect, async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Check if medicine belongs to user
    if (medicine.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    medicine.accepted = !medicine.accepted;
    const updatedMedicine = await medicine.save();

    res.json(updatedMedicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a medicine
// @route   DELETE /api/medicines/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Check if medicine belongs to user
    if (medicine.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await medicine.remove();
    res.json({ message: 'Medicine removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;