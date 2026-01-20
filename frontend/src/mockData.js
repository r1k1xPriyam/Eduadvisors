import { allCoursesData } from './allCoursesData';

export const heroImages = [
  "https://customer-assets.emergentagent.com/job_7c233dd2-f1b6-43b7-976c-4fdf6cdbe91b/artifacts/2yjqaxce_WhatsApp%20Image%202025-12-25%20at%2011.47.59%20AM%20%281%29.jpeg",
  "https://customer-assets.emergentagent.com/job_7c233dd2-f1b6-43b7-976c-4fdf6cdbe91b/artifacts/3pbtktgr_WhatsApp%20Image%202025-12-25%20at%2011.47.59%20AM%20%282%29.jpeg",
  "https://customer-assets.emergentagent.com/job_7c233dd2-f1b6-43b7-976c-4fdf6cdbe91b/artifacts/ubi8mta4_WhatsApp%20Image%202025-12-25%20at%2011.47.59%20AM.jpeg"
];

export const services = [
  {
    title: "Career Counselling",
    description: "Personalized guidance to help you choose the best career path tailored to your strengths and aspirations.",
    icon: "Target"
  },
  {
    title: "Education Consultancy",
    description: "Expert advice on selecting top colleges and programs that align with your academic goals.",
    icon: "GraduationCap"
  },
  {
    title: "Entrance Exam Support",
    description: "Comprehensive guidance for JEE-MAINS, NEET, WBJEE, JENPAS-UG, GNM and more.",
    icon: "BookOpen"
  },
  {
    title: "Course Selection",
    description: "Recommendations for engineering, medical, management, and other fields based on your interests.",
    icon: "Lightbulb"
  },
  {
    title: "Transparent Admission Process",
    description: "No advance payments for seat bookings and no hidden charges. Complete transparency guaranteed.",
    icon: "Shield"
  }
];

export const coursesData = [
  {
    id: "cse",
    name: "CSE",
    full_name: "Computer Science Engineering",
    type: "undergraduate",
    duration: "4 Years",
    description: "Computer Science Engineering focuses on programming, algorithms, software development, artificial intelligence, and data science. This field is at the forefront of technological innovation.",
    career_prospects: ["Software Engineer", "Data Scientist", "AI/ML Engineer", "Cloud Architect", "Cybersecurity Expert", "Full Stack Developer"],
    why_choose: "CSE offers the highest placement rates and salary packages. With the tech industry booming, demand for skilled CS professionals is at an all-time high. Average starting salary ranges from ₹6-15 LPA.",
    colleges_offering: [
      {
        college_name: "BITS Pilani",
        average_placement: "₹18 LPA",
        top_companies: ["Google", "Microsoft", "Amazon"],
        specialization: "AI & Machine Learning",
        why_recommended: "Top-tier faculty, excellent coding culture, and consistent placements in FAANG companies."
      },
      {
        college_name: "VIT",
        average_placement: "₹12 LPA",
        top_companies: ["PayPal", "Cisco", "Amazon"],
        specialization: "Software Development",
        why_recommended: "Strong industry connections and hands-on practical training with modern tech stack."
      },
      {
        college_name: "SRM University",
        average_placement: "₹9 LPA",
        top_companies: ["Cognizant", "Wipro", "TCS"],
        specialization: "Full Stack Development",
        why_recommended: "Comprehensive curriculum with focus on emerging technologies and startup culture."
      }
    ]
  },
  {
    id: "mbbs",
    name: "MBBS",
    full_name: "Bachelor of Medicine, Bachelor of Surgery",
    type: "undergraduate",
    duration: "5.5 Years",
    description: "MBBS is the foundational medical degree that prepares students to become physicians. It combines theoretical knowledge with extensive practical training in hospitals.",
    career_prospects: ["Doctor", "Surgeon", "Medical Researcher", "Healthcare Administrator", "Public Health Specialist"],
    why_choose: "Medicine offers job security, respect, and the opportunity to make a real difference in people's lives. With India's growing healthcare needs, qualified doctors are always in demand.",
    colleges_offering: [
      {
        college_name: "Manipal University",
        average_placement: "Government/Private Hospitals",
        top_companies: ["Apollo Hospitals", "Fortis Healthcare", "Max Healthcare"],
        specialization: "General Medicine & Surgery",
        why_recommended: "Renowned medical faculty, excellent hospital infrastructure, and comprehensive clinical exposure."
      }
    ]
  },
  {
    id: "mba",
    name: "MBA",
    full_name: "Master of Business Administration",
    type: "postgraduate",
    duration: "2 Years",
    description: "MBA develops leadership, strategic thinking, and business management skills. It covers finance, marketing, operations, HR, and entrepreneurship.",
    career_prospects: ["Business Manager", "Consultant", "Investment Banker", "Product Manager", "Entrepreneur", "Marketing Manager"],
    why_choose: "MBA graduates command premium salaries and accelerated career growth. Average package ranges from ₹8-20 LPA. Opens doors to leadership roles across industries.",
    colleges_offering: [
      {
        college_name: "BITS Pilani",
        average_placement: "₹15 LPA",
        top_companies: ["Goldman Sachs", "McKinsey", "Deloitte"],
        specialization: "Finance & Consulting",
        why_recommended: "Strong alumni network, case-study based learning, and excellent corporate connections."
      },
      {
        college_name: "LPU",
        average_placement: "₹8 LPA",
        top_companies: ["Amazon", "Cognizant", "KPMG"],
        specialization: "General Management",
        why_recommended: "Industry-oriented curriculum with live projects and internship opportunities."
      }
    ]
  },
  {
    id: "ece",
    name: "ECE",
    full_name: "Electronics and Communication Engineering",
    type: "undergraduate",
    duration: "4 Years",
    description: "ECE deals with electronic devices, circuits, communication systems, and signal processing. It combines hardware and software aspects of technology.",
    career_prospects: ["Electronics Engineer", "Embedded Systems Developer", "Telecom Engineer", "IoT Specialist", "VLSI Designer"],
    why_choose: "ECE graduates are versatile and can work in both core electronics and IT sectors. Growing demand in IoT, 5G, and embedded systems. Average package: ₹5-10 LPA.",
    colleges_offering: [
      {
        college_name: "VIT",
        average_placement: "₹10 LPA",
        top_companies: ["Qualcomm", "Intel", "Texas Instruments"],
        specialization: "VLSI & Embedded Systems",
        why_recommended: "Excellent labs, industry collaborations, and focus on practical implementation."
      },
      {
        college_name: "BITS Pilani",
        average_placement: "₹14 LPA",
        top_companies: ["Cisco", "Samsung", "Broadcom"],
        specialization: "Communication Systems",
        why_recommended: "Strong research focus and excellent placement track record in core companies."
      }
    ]
  },
  {
    id: "bca",
    name: "BCA",
    full_name: "Bachelor of Computer Applications",
    type: "undergraduate",
    duration: "3 Years",
    description: "BCA is a comprehensive program focusing on computer applications, programming, and software development fundamentals.",
    career_prospects: ["Software Developer", "Web Developer", "System Analyst", "Network Administrator", "App Developer"],
    why_choose: "Shorter duration than B.Tech with strong IT job prospects. Cost-effective path to IT careers. Average package: ₹3-6 LPA with growth potential.",
    colleges_offering: [
      {
        college_name: "Chandigarh University",
        average_placement: "₹5 LPA",
        top_companies: ["Wipro", "Capgemini", "Tech Mahindra"],
        specialization: "Software Development",
        why_recommended: "Modern curriculum aligned with industry needs and good placement support."
      }
    ]
  },
  {
    id: "bpharm",
    name: "B Pharm",
    full_name: "Bachelor of Pharmacy",
    type: "undergraduate",
    duration: "4 Years",
    description: "B.Pharm focuses on pharmaceutical sciences, drug development, and healthcare. It prepares students for careers in the pharmaceutical industry.",
    career_prospects: ["Pharmacist", "Drug Inspector", "Research Scientist", "Medical Representative", "Quality Control Analyst"],
    why_choose: "Growing pharmaceutical industry in India offers stable career opportunities. Can work in hospitals, research, or pharma companies. Average package: ₹3-6 LPA.",
    colleges_offering: [
      {
        college_name: "Manipal University",
        average_placement: "₹5 LPA",
        top_companies: ["Sun Pharma", "Dr. Reddy's", "Cipla"],
        specialization: "Pharmaceutical Sciences",
        why_recommended: "Well-equipped labs, experienced faculty, and strong industry connections."
      },
      {
        college_name: "BITS Pilani",
        average_placement: "₹6 LPA",
        top_companies: ["Pfizer", "GSK", "Abbott"],
        specialization: "Drug Development",
        why_recommended: "Research-oriented approach with opportunities for higher studies and innovation."
      }
    ]
  }
];

export const undergraduateCourses = [
  "CSE", "CSE Specialization", "IT", "ECE", "EEE", "B Pharm", "MBBS", "BDS", "BAMS", "BHMS", "BOTT",
  "BPT", "BMLT", "BOPTO", "BSC Nursing", "BCA", "BBA", "BA LLB", "BBA LLB", "BSC LLB",
  "BSC Agriculture", "B.Tech Agriculture", "BSC Biotech", "B.Tech Biotech", "BHM", "BHA", "Mechanical", "Civil"
];

export const postgraduateCourses = [
  "M.Tech CSE", "M.Tech IT", "M.Tech ECE", "M.Tech EEE", "M.Pharm", "MD", "MS", "MDS",
  "MD/MS Ayurveda", "M.D Homeopathy", "MPT", "MLT", "M.Optom", "MSC Nursing",
  "MCA", "MBA", "LLM", "MSC Agriculture", "M.Tech Agriculture", "MSC Biotech",
  "MSC in Biotech", "MHIM", "MHA"
];

export const colleges = [
  {
    id: "bits-pilani",
    name: "BITS Pilani",
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop",
    description: "Birla Institute of Technology and Science (BITS) Pilani is one of India's premier institutions, known for its excellence in engineering, science, and management education.",
    website: "https://www.bits-pilani.ac.in",
    nirf_rank: 30,
    naac_grade: "A",
    location: "Pilani, Rajasthan",
    established_year: 1964,
    specializations: ["Computer Science", "Electronics", "Mechanical", "Chemical", "Pharmacy", "Management"],
    placement_stats: {
      average_package: "₹15-18 LPA",
      highest_package: "₹60 LPA+",
      placement_rate: "95%"
    },
    facilities: ["World-class labs", "Digital library", "Sports complex", "Innovation center", "Hostels"],
    top_recruiters: ["Google", "Microsoft", "Amazon", "Flipkart", "Goldman Sachs", "Cisco"]
  },
  {
    id: "manipal-university",
    name: "Manipal University",
    logo: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop",
    description: "Manipal Academy of Higher Education is a multi-disciplinary institution offering programs in medicine, engineering, management, and allied sciences.",
    website: "https://manipal.edu",
    nirf_rank: 45,
    naac_grade: "A++",
    location: "Manipal, Karnataka",
    established_year: 1953,
    specializations: ["Medicine", "Engineering", "Pharmacy", "Management", "Architecture"],
    placement_stats: {
      average_package: "₹8-12 LPA",
      highest_package: "₹45 LPA",
      placement_rate: "92%"
    },
    facilities: ["Modern hospitals", "Research centers", "International collaborations", "Smart classrooms"],
    top_recruiters: ["Cognizant", "TCS", "Infosys", "Accenture", "Deloitte", "Ernst & Young"]
  },
  {
    id: "vit",
    name: "VIT",
    logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&h=100&fit=crop",
    description: "Vellore Institute of Technology is recognized for its academic excellence and high-quality research in engineering and technology.",
    website: "https://vit.ac.in",
    nirf_rank: 15,
    naac_grade: "A++",
    location: "Vellore, Tamil Nadu",
    established_year: 1984,
    specializations: ["Computer Science", "IT", "Electronics", "Mechanical", "Civil", "Biotechnology"],
    placement_stats: {
      average_package: "₹9.23 LPA",
      highest_package: "₹75 LPA",
      placement_rate: "94%"
    },
    facilities: ["State-of-art labs", "Incubation center", "International exchange programs", "Sports facilities"],
    top_recruiters: ["PayPal", "Cisco", "Amazon", "Morgan Stanley", "DE Shaw", "Qualcomm"]
  },
  {
    id: "srm-university",
    name: "SRM University",
    logo: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=100&h=100&fit=crop",
    description: "SRM Institute of Science and Technology is a leading institution with strong industry connections and excellent placement records.",
    website: "https://www.srmist.edu.in",
    nirf_rank: 40,
    naac_grade: "A++",
    location: "Chennai, Tamil Nadu",
    established_year: 1985,
    specializations: ["Engineering", "Management", "Medicine", "Science", "Law"],
    placement_stats: {
      average_package: "₹8.5 LPA",
      highest_package: "₹54 LPA",
      placement_rate: "90%"
    },
    facilities: ["Innovation labs", "Medical college", "International campus", "Entrepreneurship cell"],
    top_recruiters: ["Cognizant", "Wipro", "TCS", "Tech Mahindra", "L&T", "Ashok Leyland"]
  },
  {
    id: "lpu",
    name: "LPU",
    logo: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=100&h=100&fit=crop",
    description: "Lovely Professional University is India's largest private university with diverse programs and excellent placement support.",
    website: "https://www.lpu.in",
    nirf_rank: 55,
    naac_grade: "A+",
    location: "Phagwara, Punjab",
    established_year: 2005,
    specializations: ["Engineering", "Management", "Design", "Agriculture", "Pharmacy", "Law"],
    placement_stats: {
      average_package: "₹6-8 LPA",
      highest_package: "₹64 LPA",
      placement_rate: "88%"
    },
    facilities: ["Massive campus", "Industry tie-ups", "International collaborations", "Skill development"],
    top_recruiters: ["Amazon", "Cognizant", "TCS", "Tech Mahindra", "IBM", "Infosys"]
  },
  {
    id: "chandigarh-university",
    name: "Chandigarh University",
    logo: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100&h=100&fit=crop",
    description: "A fast-growing university known for its modern infrastructure and industry-oriented curriculum.",
    website: "https://www.cuchd.in",
    nirf_rank: 85,
    naac_grade: "A+",
    location: "Mohali, Punjab",
    established_year: 2012,
    specializations: ["Engineering", "Management", "Hotel Management", "Design", "Pharmacy"],
    placement_stats: {
      average_package: "₹6.5 LPA",
      highest_package: "₹50 LPA",
      placement_rate: "85%"
    },
    facilities: ["Modern campus", "Incubation center", "Sports complex", "International programs"],
    top_recruiters: ["Microsoft", "Oracle", "Wipro", "Capgemini", "Cognizant", "Adobe"]
  }
];

export const whyChooseUs = [
  {
    title: "Experienced Guidance",
    description: "Shaping student careers since 2019 with proven expertise.",
    icon: "Award"
  },
  {
    title: "Wide Network",
    description: "Collaborating with top ranked colleges (NIRF, NAAC) across India.",
    icon: "Network"
  },
  {
    title: "Personalized Support",
    description: "Tailored counselling to match your individual goals and aspirations.",
    icon: "Users"
  },
  {
    title: "Proven Success",
    description: "Hundreds of students placed in prestigious institutions nationwide.",
    icon: "TrendingUp"
  }
];

export const statistics = [
  { label: "Years of Experience", value: "6+", icon: "Calendar" },
  { label: "Students Counselled", value: "2000+", icon: "Users" },
  { label: "Partner Colleges", value: "50+", icon: "School" },
  { label: "Success Rate", value: "95%", icon: "Trophy" }
];

export const testimonials = [
  {
    name: "Priya Sharma",
    course: "B.Tech CSE, VIT",
    text: "Edu Advisor helped me choose the perfect college for my engineering dreams. Their guidance was invaluable!",
    rating: 5
  },
  {
    name: "Rahul Verma",
    course: "MBBS, Manipal University",
    text: "The counselling sessions were detailed and personalized. I got admitted to my dream medical college!",
    rating: 5
  },
  {
    name: "Anjali Das",
    course: "MBA, SRM University",
    text: "Transparent process, no hidden charges, and excellent support throughout my admission journey.",
    rating: 5
  },
  {
    name: "Arjun Kumar",
    course: "B.Tech ECE, BITS Pilani",
    text: "The team at Edu Advisor guided me through the entire JEE-MAINS preparation and college selection process. Best decision ever!",
    rating: 5
  },
  {
    name: "Sneha Patel",
    course: "BCA, Chandigarh University",
    text: "I was confused about which stream to choose. Their career counselling helped me find the perfect path!",
    rating: 5
  },
  {
    name: "Karan Singh",
    course: "B.Pharm, Manipal University",
    text: "From entrance exam guidance to admission completion - they handled everything professionally. Highly recommend!",
    rating: 5
  },
  {
    name: "Meera Reddy",
    course: "BDS, MS Ramaiah",
    text: "The educational loan assistance and transparent admission process made everything so easy for my family.",
    rating: 5
  },
  {
    name: "Vikram Joshi",
    course: "M.Tech CSE, VIT",
    text: "Their knowledge about different colleges and placement records helped me make an informed decision.",
    rating: 5
  },
  {
    name: "Pooja Agarwal",
    course: "BSC Nursing, LPU",
    text: "Edu Advisor provided complete support from counselling to course registration. Thank you team!",
    rating: 5
  }
];

export const faqs = [
  {
    question: "What services does Edu Advisor provide?",
    answer: "We provide career counselling, education consultancy, entrance exam support (JEE, NEET, WBJEE, etc.), course selection guidance, and transparent admission assistance for undergraduate and postgraduate programs."
  },
  {
    question: "Is there any fee for counselling?",
    answer: "At Edu Advisor, we provide counselling facility without any cost. We focus on transparency and personalized support to help you make informed decisions."
  },
  {
    question: "Which colleges do you partner with?",
    answer: "We collaborate with top-ranked colleges (NIRF, NAAC) across India including BITS Pilani, Manipal, VIT, SRM, LPU, Chandigarh University, and many more prestigious institutions."
  },
  {
    question: "Do you charge advance payments for seat booking?",
    answer: "No, we maintain complete transparency. There are no advance payments for seat bookings and absolutely no hidden charges throughout the admission process."
  },
  {
    question: "How can I contact Edu Advisor?",
    answer: "You can reach us via phone at +91-9332641552 or +91-9339475845, or email us at info.eduadvisor26@gmail.com. You can also fill out the inquiry form on our website."
  }
];

export const contactInfo = {
  phones: ["9332641552", "9382454940"],
  email: "info.eduadvisor26@gmail.com",
  tagline: "Learn Today Earn tomorrow"
};