const User = require("../../models/auth/user");
const Candidate = require("../../models/dashboard/candidate");
const Template = require("../../models/templates");
const { getCandidateDashboardData } = require("../candidates");
const cookie = require("cookie");

// ✅ Create Multiple Templates
exports.createTemplates = async (templates) => {
    return await Template.insertMany(templates);
};

// ✅ Get All Templates
exports.getAllTemplates = async () => {
    return await Template.find().sort({ createdAt: -1 });
};

// ✅ Get Template by ID
exports.getTemplateById = async (slug) => {
    return await Template.findOne({ previewUrl: slug });
};

// ✅ Update Template by ID
exports.updateTemplate = async (id, data) => {
    return await Template.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

// ✅ Delete Template by ID
exports.deleteTemplate = async (id) => {
    return await Template.findByIdAndDelete(id);
};

// ✅ Initialize Templates (Only Runs Once on Server Start)
exports.initializeTemplates = async (Templates) => {
    try {
        const templates = await this.getAllTemplates(); // Fetch existing templates

        if (templates.length === 0) {
            await this.createTemplates(Templates);
        }
    } catch (error) {
        console.error("Error initializing templates:", error);
    }
};



exports.getProfileDashboard = async (profile, req, template) => {
    let dashboard = null;
    const cookies = cookie.parse(req.headers.cookie || "");
    const userId = cookies.userId;
    

    if (profile) {
        let user = await User.findOne({ userName: profile });
        
        if (user) {
            let userDashboardData = await getCandidateDashboardData(user._id);            

            // Check if template exists
            const matchedTemplate = userDashboardData?.templates?.find((t) => {
                return (
                    t._id?.toString() === template._id?.toString() ||
                    t.templateId?.toString() === template._id?.toString()
                );
            });
            
            

            if(matchedTemplate) {
                if(userId === user._id.toString()){
                    dashboard = userDashboardData;
                }
                else if(matchedTemplate.status === "active"){
                                        
                // Increment views for public view
                const candidate = await Candidate.findOne({ user: user._id });               

                const templateToUpdate = candidate.templates.find((t) => {
                    return (
                        t._id?.toString() === template._id?.toString() ||
                        t.templateId?.toString() === template._id?.toString()
                    );
                });                

                if (templateToUpdate) {
                    templateToUpdate.views = (templateToUpdate.views || 0) + 1;
                    await candidate.save();
                }
                    dashboard = userDashboardData;
                }
            }          

        }
    }

    return {
        personal: {
            name: dashboard ? dashboard.user ? dashboard.user.name : "" : "John Doe",
            title: dashboard ? dashboard.personalDetails ? dashboard.personalDetails.headline : "" : "Senior Frontend Developer",
            email: dashboard ? dashboard.user ? dashboard.user.email : "": "john.doe@example.com",
            phone: dashboard ? dashboard.personalDetails ? dashboard.personalDetails.phone : "" : "+1 (555) 123-4567",
            website: dashboard ? dashboard.personalDetails ? dashboard.personalDetails.website : "" : "https://johndoe.com",
            location: dashboard ? dashboard.address[0] ? dashboard.address[0].city + ", " + dashboard.address[0].state : "" : "San Francisco, CA",
            about: dashboard ? dashboard.personalDetails ? dashboard.personalDetails.bio : "" : "Experienced frontend developer with a passion for creating responsive and accessible web applications. Proficient in React, TypeScript, and modern JavaScript frameworks. Strong problem-solving skills and a team player with excellent communication abilities.",
            profileImage: dashboard ? dashboard.personalDetails ? dashboard.personalDetails.profileImage : "" : "https://example.com/profile.jpg",
        },
        experience: dashboard ? Array.isArray(dashboard.experience) ? dashboard.experience : [] :
            [
                {
                    title: "Senior Frontend Developer",
                    company: "Tech Solutions Inc.",
                    location: "San Francisco, CA",
                    startDate: "2020",
                    endDate: "Present",
                    description: "Lead frontend development for enterprise SaaS products.",
                    achievements: [
                        "Reduced page load time by 40% through code optimization",
                        "Implemented CI/CD pipeline for frontend deployments",
                        "Led migration from legacy codebase to React"
                    ]
                },
                {
                    title: "Frontend Developer",
                    company: "WebDev Agency",
                    location: "New York, NY",
                    startDate: "2017",
                    endDate: "2020",
                    description: "Developed responsive websites and web applications.",
                    achievements: [
                        "Built 20+ client websites using modern frontend technologies",
                        "Implemented accessibility improvements across all projects",
                        "Received client satisfaction rating of 4.9/5"
                    ]
                }
            ],
        education: dashboard ? Array.isArray(dashboard.education) ? dashboard.education : [] :
            [
                {
                    degree: "Master of Science in Computer Science",
                    fieldOfStudy: "Computer Science",
                    institution: "Stanford University",
                    location: "Stanford, CA",
                    startDate: "2018",
                    endDate: "2020",
                    description: "Focused on web technologies and user interface design.",
                    gpa: "3.9",
                    thesis: "Neural Network Optimization Techniques",
                    advisors: ["Dr. Sarah Smith", "Dr. Michael Johnson"],
                    publications: [
                        "Machine Learning in Web Development",
                        "Optimizing Neural Networks for Web Applications"
                    ]
                },
                {
                    degree: "Bachelor of Science in Computer Engineering",
                    fieldOfStudy: "Computer Science",
                    institution: "University of California, Berkeley",
                    location: "Berkeley, CA",
                    startDate: "2014",
                    endDate: "2018",
                    description: "Graduated with honors. Dean's List all semesters.",
                    gpa: "3.8",
                    honors: ["Summa Cum Laude", "Dean's List 2014-2018"],
                    activities: ["Robotics Club President", "ACM Student Chapter"]
                }
            ],
        skills: dashboard ? Array.isArray(dashboard.skills) ? dashboard.skills : [] :
            [
                { name: "React", level: 95 },
                { name: "TypeScript", level: 90 },
                { name: "Node.js", level: 85 },
                { name: "GraphQL", level: 80 },
                { name: "UI/UX Design", level: 75 }
            ],
        languages: dashboard ? Array.isArray(dashboard.languages) ? dashboard.languages : [] :
            [
                { name: "English", proficiency: "Native" },
                { name: "Spanish", proficiency: "Professional" },
                { name: "French", proficiency: "Intermediate" }
            ],
        certifications: dashboard ? Array.isArray(dashboard.certifications) ? dashboard.certifications : [] :
            [
                {
                    name: "AWS Certified Developer",
                    issuingOrganization: "Amazon Web Services",
                    issueDate: "2022",
                    description: "Associate level certification for AWS development",
                    expirationDate: 'no-expiration',
                    credentialId: 'HIREONAI_902',
                    credentialUrl: 'https://hironai.com/'
                },
                {
                    name: "Google Cloud Professional",
                    issuingOrganization: "Google",
                    issueDate: "2021",
                    description: "Professional certification for cloud architecture",
                    expirationDate: 'no-expiration',
                    credentialId: 'HIREONAI_902',
                    credentialUrl: 'https://hironai.com/'
                }
            ],
        projects: dashboard ? Array.isArray(dashboard.projects) ? dashboard.projects : [] :
            [
                {
                    name: "E-commerce Platform",
                    description: "Built a full-featured e-commerce platform with React and Node.js",
                    link: "https://github.com/johndoe/ecommerce",
                    technologies: ["React", "Node.js", "MongoDB", "Express"],
                    role: "Lead Developer",
                    startDate: "20 Jan 2022",
                    endDate: "10 April 2023",
                    responsibilities: [
                        "Designed the frontend architecture",
                        "Implemented RESTful APIs",
                        "Integrated payment gateways"
                    ]
                },
                {
                    name: "Task Management App",
                    description: "Developed a real-time task management application",
                    link: "https://github.com/johndoe/taskmanager",
                    technologies: ["React", "Firebase", "Material UI"],
                    role: "Full Stack Developer",
                    startDate: "01 Feb 2023",
                    endDate: "12 May 2024",
                    responsibilities: [
                        "Designed the frontend architecture",
                        "Implemented RESTful APIs",
                    ]
                }
            ],
        publications: dashboard ? Array.isArray(dashboard.publications) ? dashboard.publications : [] :
            [
                {
                    title: "Modern Web Development Practices",
                    journal: "Journal of Web Technologies",
                    year: "2022",
                    doi: "10.1234/jwt.2022.001"
                },
                {
                    title: "Optimizing React Applications",
                    conference: "WebTech Conference 2021",
                    year: "2021",
                    location: "Virtual"
                }
            ],
        research: dashboard ? Array.isArray(dashboard.research) ? dashboard.research : [] :
            [
                {
                    title: "Neural Network Optimization",
                    institution: "Stanford University",
                    duration: "2019-2020",
                    supervisor: "Dr. Sarah Smith"
                },
                {
                    title: "Web Performance Metrics",
                    institution: "Berkeley Labs",
                    duration: "2017-2018",
                    supervisor: "Dr. John Brown"
                }
            ],
            isPorfileCompleted: dashboard && dashboard?.isPorfileCompleted
    };
}