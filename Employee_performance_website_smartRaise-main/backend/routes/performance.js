const express = require('express');
const router = express.Router();
const Performance = require('../models/Performance');
const Employee = require('../models/Employee');

// Get all performance records
router.get('/', async (req, res) => {
    try {
        const performances = await Performance.find()
            .populate('employeeId', 'name department role');
        res.json(performances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get performance records for a specific employee
router.get('/employee/:employeeId', async (req, res) => {
    try {
        const performances = await Performance.find({ employeeId: req.params.employeeId })
            .populate('employeeId', 'name department role')
            .sort({ date: -1 });
        res.json(performances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create performance record
router.post('/', async (req, res) => {
    try {
        // Check if employee exists
        const employee = await Employee.findById(req.body.employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const performance = new Performance({
            employeeId: req.body.employeeId,
            kpiScore: req.body.kpiScore,
            attendance: req.body.attendance,
            peerReview: req.body.peerReview,
            notes: req.body.notes
        });

        const newPerformance = await performance.save();
        await newPerformance.populate('employeeId', 'name department role');
        res.status(201).json(newPerformance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update performance record
router.patch('/:id', async (req, res) => {
    try {
        const performance = await Performance.findById(req.params.id);
        if (!performance) {
            return res.status(404).json({ message: 'Performance record not found' });
        }

        if (req.body.kpiScore) performance.kpiScore = req.body.kpiScore;
        if (req.body.attendance) performance.attendance = req.body.attendance;
        if (req.body.peerReview) performance.peerReview = req.body.peerReview;
        if (req.body.notes) performance.notes = req.body.notes;

        const updatedPerformance = await performance.save();
        await updatedPerformance.populate('employeeId', 'name department role');
        res.json(updatedPerformance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete performance record
router.delete('/:id', async (req, res) => {
    try {
        const performance = await Performance.findById(req.params.id);
        if (!performance) {
            return res.status(404).json({ message: 'Performance record not found' });
        }

        await Performance.deleteOne({ _id: req.params.id });
        res.json({ message: 'Performance record deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 