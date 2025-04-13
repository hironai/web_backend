const Templates = [
    {
        "name": "Modern Professional",
        "description": "A clean and professional template with a modern design",
        "category": "Professional",
        "premium": false,
        "popular": true,
        "previewUrl": "modern-professional"
    },
    {
        "name": "Creative Portfolio",
        "description": "A creative template for showcasing your portfolio",
        "category": "Creative",
        "premium": false,
        "popular": false,
        "previewUrl": "creative-portfolio"
    },
    {
        "name": "Minimalist",
        "description": "A simple and minimalist template focusing on content",
        "category": "Minimal",
        "premium": false,
        "popular": false,
        "previewUrl": "minimalist"
    },
    // {
    //     "name": "Executive Summary",
    //     "description": "A premium template for executives and senior professionals",
    //     "category": "Executive",
    //     "premium": true,
    //     "price": "$4.99",
    //     "popular": false,
    //     "previewUrl": "executive-summary"
    // },
    {
        "name": "Executive Summary",
        "description": "A premium template for executives and senior professionals",
        "category": "Executive",
        "premium": false,
        "popular": false,
        "previewUrl": "executive-summary"
    },
    {
        "name": "Technical Resume",
        "description": "A template designed for technical roles",
        "category": "Technical",
        "premium": false,
        "popular": false,
        "previewUrl": "technical-resume"
    },
    {
        "name": "Academic CV",
        "description": "A comprehensive template for academic professionals",
        "category": "Academic",
        "premium": false,
        "popular": false,
        "previewUrl": "academic-cv"
    },
    {
        "name": "Simple Clean",
        "description": "A clean and straightforward template",
        "category": "Minimal",
        "premium": false,
        "popular": false,
        "previewUrl": "simple-clean"
    },
    {
        "name": "Creative Designer",
        "description": "A visually appealing template for creative professionals",
        "category": "Creative",
        "premium": false,
        "popular": false,
        "previewUrl": "creative-designer"
    }
];



const UserTemplateData =  {
    personal: {
        name: "John Doe",
        title: "Senior Frontend Developer",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        website: "https://johndoe.com",
        location: "San Francisco, CA",
        about: "Experienced frontend developer with a passion for creating responsive and accessible web applications. Proficient in React, TypeScript, and modern JavaScript frameworks. Strong problem-solving skills and a team player with excellent communication abilities."
    },
    experience: [
        {
            title: "Senior Frontend Developer",
            company: "Tech Solutions Inc.",
            location: "San Francisco, CA",
            startDate: "2020 ",
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
    education: [
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
    skills: [
        { name: "React", level: 95 },
        { name: "TypeScript", level: 90 },
        { name: "Node.js", level: 85 },
        { name: "GraphQL", level: 80 },
        { name: "UI/UX Design", level: 75 }
    ],

    languages: [
        { name: "English", proficiency: "Native" },
        { name: "Spanish", proficiency: "Professional" },
        { name: "French", proficiency: "Intermediate" }
    ],

    certifications: [
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

    projects: [
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

    publications: [
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

    research: [
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
    ]
};

module.exports = { Templates, UserTemplateData };