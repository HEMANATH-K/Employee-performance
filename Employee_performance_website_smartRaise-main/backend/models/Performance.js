const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    kpiScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    attendance: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    peerReview: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    date: {
        type: Date,
        default: Date.now
    },
    predictedPerformance: {
        type: Number,
        min: 0,
        max: 100
    },
    notes: {
        type: String,
        trim: true
    }
});

// Index for efficient queries
performanceSchema.index({ employeeId: 1, date: -1 });

module.exports = mongoose.model('Performance', performanceSchema); 