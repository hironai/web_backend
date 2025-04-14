const mongoose = require("mongoose");
const { Notifications } = require("../../constants/NOTIFICATIONS");

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    value: { type: Boolean, default: false },
    changeAllowed: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now }
});


const candidateSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    isSearchEnable: { type: Boolean, default: true, index: true  },
    name: { type: String, default: "" },
    email: { type: String, default: ""},

    personalDetails: {
        phone: { type: String, default: "" },
        website: { type: String, default: "" },
        dateOfBirth: { type: String, default: "" },
        headline: { type: String, default: "" },
        bio: { type: String, default: "" },
    },

    professionalDetails: {
        type: [
            {
                currentTitle: { type: String, default: "" },
                currentCompany: { type: String, default: "" },
                industry: { type: String, default: "" },
                yearsOfExperience: { type: Number, default: 0 }, // Numeric index for filtering
                skills: { type: [String], default: [] },
                summary: { type: String, default: "" },
            }
        ],
        default: []
    },

    experience: { 
        type: [{
            title: { type: String, default: "" },
            company: { type: String, default: "" },
            location: { type: String, default: "" },
            startDate: { type: String, default: "" },
            endDate: { type: String, default: "" },
            description: { type: String, default: "", maxlength: 5000 },
            achievements: [{ type: String, default: "", maxlength: 5000 }],
        }], 
        default: []
    },

    education: { 
        type: [{
            degree: { type: String, default: "" },
            fieldOfStudy: { type: String, default: "" },
            institution: { type: String, default: "" },
            location: { type: String, default: "" },
            startDate: { type: String, default: "" },
            endDate: { type: String, default: "" },
            gpa: { type: String, default: "" },
            description: { type: String, default: "", maxlength: 500 },
            publications: [{ type: String, default: "" }],
            thesis: { type: String, default: "" },
            advisors: [{ type: String, default: "" }],
            honors: [{ type: String, default: "" }],
            activities: [{ type: String, default: "" }],
        }], 
        default: []
    },

    publications: { 
        type: [{
            title: { type: String, default: "" },
            journal: { type: String, default: "" },
            year: { type: String, default: "" },
            doi: { type: String, default: "" },
        }], 
        default: []
    },

    research: { 
        type: [{
            title: { type: String, default: "" },
            institution: { type: String, default: "" },
            duration: { type: String, default: "" },
            supervisor: { type: String, default: "" },
        }], 
        default: []
    },

    certifications: { 
        type: [{
            name: { type: String, default: "" },
            issuingOrganization: { type: String, default: "" },
            issueDate: { type: String, default: "" },
            expirationDate: { type: String, default: "no-expiration" },
            credentialId: { type: String, default: "" },
            credentialUrl: { type: String, default: "" },
            description: { type: String, default: "", maxlength: 500 },
        }], 
        default: []
    },

    projects: { 
        type: [{
            name: { type: String, default: "" },
            description: { type: String, default: "", minlength: 10, maxlength: 1000 },
            startDate: { type: String, default: "" },
            endDate: { type: String, default: "" },
            projectUrl: { type: String, default: "" },
            technologies: { type: [String], default: [] },
            role: { type: String, default: "" },
            responsibilities: { type: [String], default: [] },
        }], 
        default: []
    },

    links: { 
        type: [{
            title: { type: String, default: "" },
            url: { type: String, default: "" },
            type: { type: String, enum: ["website", "github", "linkedin", "twitter", "instagram", "youtube", "facebook", "other"], default: "other" },
        }], 
        default: []
    },

    address: {
        type: [
            {
                addressLine1: { type: String, default: "" },
                addressLine2: { type: String, default: "" },
                city: { type: String, default: "" },
                state: { type: String, default: "" },
                postalCode: { type: String, default: "" },
                country: { type: String, default: "" },
                isPublic: { type: Boolean, default: false },
            }
        ],
        default: []
    },

    skills: {
        type: [
            {
                name: { type: String, default: "" },
                level: { type: Number, default: 0 },
            }
        ],
        default: []
    },

    languages: {
        type: [
            {
                name: { type: String, default: "" },
                proficiency: { type: String, default: "", enum: ["Native", "Professional", "Intermediate"] },
            }
        ],
        default: []
    },

    achievements: { 
        type: [{
            title: { type: String, default: "" },
            description: { type: String, default: "", maxlength: 500 },
            date: { type: String },
            issuer: { type: String },
        }], 
        default: []
    },

    templates: { 
        type: [{
            templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
            status: { type: String, enum: ["active", "inactive"] },
            views: { type: Number, default: 0 },
        }], 
        default: []
    },

    paymentSettings: {
        methods: { type: Array, default: [] },
        cards: { type: Array, default: [] },
        history: { type: Array, default: [] },
    },
    
    notificationSettings: {
            type: [notificationSchema],
            default: Notifications
        },
    
}, { timestamps: true });

// 🔍 Full-Text Search Indexes
candidateSchema.index({
    "personalDetails.bio": "text",
    "professionalDetails.currentTitle": "text",
    "professionalDetails.skills": "text",
    "professionalDetails.currentCompany": "text",
    "professionalDetails.summary": "text",
    "education.degree": "text",
    "education.institution": "text",
    "education.description": "text",
    "experience.title": "text",
    "experience.company": "text",
    "experience.description": "text",
    "experience.achievements": "text",
    "address.city": "text",
    "address.state": "text",
    "address.country": "text",
    "address.addressLine1": "text",
    "address.addressLine2": "text",
    "achievements.title": "text",
    "achievements.description": "text",
    "projects.name": "text",
    "projects.description": "text",
    "projects.technologies": "text",
    "certifications.name": "text",
    "certifications.description": "text",
    "certifications.issuingOrganization": "text",
    // "name": "text",
    // "email": "text"
}, {
    name: "CandidateSearchIndex",
    default_language: "english"
});


// 🔍 Compound Index for Faster Filtering
candidateSchema.index({ isSearchEnable: 1, "address.state": 1 });
candidateSchema.index({ "professionalDetails.yearsOfExperience": 1 }, { sparse: true });

// Indexes for filter/search optimization
// candidateSchema.index({ "professionalDetails.yearsOfExperience": 1 });
// candidateSchema.index({ "address.city": 1 });
// candidateSchema.index({ "address.state": 1 });
// candidateSchema.index({ "address.country": 1 });

// // These are multikey indexes (on array subfields) - VALID ✅
// candidateSchema.index({ "research.title": 1 });
// candidateSchema.index({ "research.institution": 1 });
// candidateSchema.index({ "publications.title": 1 });
// candidateSchema.index({ "publications.journal": 1 });

// // Compound filters for common search use cases
// candidateSchema.index({ isSearchEnable: 1, "address.state": 1 });
// candidateSchema.index({ isSearchEnable: 1, "professionalDetails.yearsOfExperience": 1 });


// // 🔍 Full-Text Search Indexes
// candidateSchema.index({
//     "personalDetails.bio": "text",
//     "professionalDetails.currentTitle": "text",
//     "professionalDetails.skills": "text",
//     "professionalDetails.currentCompany": "text",
//     "professionalDetails.summary": "text",
//     "education.degree": "text",
//     "education.institution": "text",
//     "education.description": "text",
//     "education.fieldOfStudy": "text",
//     "education.publications": "text",
//     "education.thesis": "text",
//     "experience.title": "text",
//     "experience.company": "text",
//     "experience.description": "text",
//     "experience.achievements": "text",
//     "address.city": "text",
//     "address.state": "text",
//     "address.country": "text",
//     "address.addressLine1": "text",
//     "address.addressLine2": "text",
//     "achievements.title": "text",
//     "achievements.description": "text",
//     "projects.name": "text",
//     "projects.description": "text",
//     "projects.technologies": "text",
//     "certifications.name": "text",
//     "certifications.description": "text",
//     "certifications.issuingOrganization": "text",
//     "name": "text",
//     "email": "text"
// }, {
//     name: "CandidateSearchIndex",
//     default_language: "english"
// });


// // 🔍 Compound Index for Faster Filtering

// // Indexes for filter/search optimization
// candidateSchema.index({ user: 1 });
// candidateSchema.index({ isSearchEnable: 1 });
// candidateSchema.index({ "professionalDetails.yearsOfExperience": 1 }); // OK without sparse unless most docs don’t have it
// candidateSchema.index({ "address.city": 1 });
// candidateSchema.index({ "address.state": 1 });
// candidateSchema.index({ "address.country": 1 });

// // These are multikey indexes (on array subfields) - VALID ✅
// candidateSchema.index({ "research.title": 1 });
// candidateSchema.index({ "research.institution": 1 });
// candidateSchema.index({ "publications.title": 1 });
// candidateSchema.index({ "publications.journal": 1 });

// // Compound filters for common search use cases
// candidateSchema.index({ isSearchEnable: 1, "address.state": 1 });
// candidateSchema.index({ isSearchEnable: 1, "professionalDetails.yearsOfExperience": 1 });

const Candidate = mongoose.model("Candidate", candidateSchema);
module.exports = Candidate;