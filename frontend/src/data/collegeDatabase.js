// Comprehensive college database for chatbot & comparison tool
// 20+ colleges with realistic 2025 data

const COLLEGE_DATABASE = [
  {
    id: "vit_vellore",
    name: "VIT Vellore",
    shortName: "VIT",
    location: "Vellore, Tamil Nadu",
    region: "South",
    tier: 1,
    nirfRank: 11,
    established: 1984,
    totalFees4Yr: 840000,
    feePerYear: 210000,
    budgetCategory: "2-4L",
    avgPackageLPA: 8.5,
    highestPackageLPA: 52,
    medianPackageLPA: 6.5,
    placementPercent: 92,
    minBoardPercent: 60,
    topRecruiters: ["Microsoft", "Amazon", "Google", "TCS", "Infosys", "Wipro", "Qualcomm", "Samsung", "Deloitte", "Cognizant"],
    campusSize: "372 acres",
    admissionProcess: "VITEEE (VIT Engineering Entrance Exam) / JEE Main score",
    hostelFeePerYear: 120000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT", "Chemical", "Biotech"],
    highlights: ["NAAC A++ Grade", "Top private university", "Strong international collaborations", "Excellent campus infrastructure"],
    cutoffs: {
      "JEE Main": { rank: "< 45,000 CRL", percentile: "93+" },
      "VITEEE": { rank: "< 18,500 (ECE), < 12,000 (CSE)", score: "110+ / 125" },
      "Board %": { min: "75% (General)", sc_st: "65%" }
    },
    cutoffsByStream: {
      "ECE": { "VITEEE": "< 18,500", "JEE Main": "< 50,000" },
      "CSE": { "VITEEE": "< 12,000", "JEE Main": "< 35,000" },
      "Mechanical": { "VITEEE": "< 35,000", "JEE Main": "< 80,000" },
      "Civil": { "VITEEE": "< 40,000", "JEE Main": "< 90,000" },
      "EEE": { "VITEEE": "< 25,000", "JEE Main": "< 60,000" }
    },
    website: "https://vit.ac.in"
  },
  {
    id: "bits_pilani",
    name: "BITS Pilani",
    shortName: "BITS",
    location: "Pilani, Rajasthan",
    region: "North",
    tier: 1,
    nirfRank: 8,
    established: 1964,
    totalFees4Yr: 2000000,
    feePerYear: 500000,
    budgetCategory: ">4L",
    avgPackageLPA: 12.5,
    highestPackageLPA: 70,
    medianPackageLPA: 10,
    placementPercent: 95,
    minBoardPercent: 75,
    topRecruiters: ["Google", "Microsoft", "Goldman Sachs", "Uber", "Samsung", "Intel", "Adobe", "Oracle", "DE Shaw", "Tower Research"],
    campusSize: "328 acres",
    admissionProcess: "BITSAT (BITS Admission Test)",
    hostelFeePerYear: 150000,
    streams: ["CSE", "ECE", "EEE", "Mechanical", "Civil", "Chemical", "Pharmacy"],
    highlights: ["Deemed University", "World-class research", "Strong alumni network", "Practice School program"],
    cutoffs: {
      "BITSAT": { score: "290+ (CSE), 270+ (ECE), 240+ (Mech)" },
      "Board %": { min: "75% aggregate + 75% in PCM" }
    },
    cutoffsByStream: {
      "ECE": { "BITSAT": "270+" },
      "CSE": { "BITSAT": "290+" },
      "Mechanical": { "BITSAT": "240+" },
      "Civil": { "BITSAT": "220+" },
      "EEE": { "BITSAT": "255+" }
    },
    website: "https://www.bits-pilani.ac.in"
  },
  {
    id: "srm_chennai",
    name: "SRM Institute of Science & Technology",
    shortName: "SRM",
    location: "Chennai, Tamil Nadu",
    region: "South",
    tier: 2,
    nirfRank: 19,
    established: 1985,
    totalFees4Yr: 700000,
    feePerYear: 175000,
    budgetCategory: "<2L",
    avgPackageLPA: 6.8,
    highestPackageLPA: 41,
    medianPackageLPA: 5.2,
    placementPercent: 88,
    minBoardPercent: 55,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Amazon", "Zoho", "Accenture", "Capgemini", "Tech Mahindra"],
    campusSize: "250 acres",
    admissionProcess: "SRMJEEE (SRM Joint Engineering Entrance Exam) / JEE Main",
    hostelFeePerYear: 100000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT", "Biotech", "Automobile"],
    highlights: ["NAAC A++ Grade", "Strong placement record", "Industry partnerships", "International exchange programs"],
    cutoffs: {
      "JEE Main": { rank: "< 80,000 CRL", percentile: "88+" },
      "SRMJEEE": { rank: "< 15,000 (ECE), < 8,000 (CSE)" },
      "Board %": { min: "60% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "SRMJEEE": "< 15,000", "JEE Main": "< 85,000" },
      "CSE": { "SRMJEEE": "< 8,000", "JEE Main": "< 60,000" },
      "Mechanical": { "SRMJEEE": "< 25,000", "JEE Main": "< 120,000" },
      "Civil": { "SRMJEEE": "< 30,000", "JEE Main": "< 140,000" },
      "EEE": { "SRMJEEE": "< 20,000", "JEE Main": "< 100,000" }
    },
    website: "https://www.srmist.edu.in"
  },
  {
    id: "kiit_bbsr",
    name: "KIIT University",
    shortName: "KIIT",
    location: "Bhubaneswar, Odisha",
    region: "East",
    tier: 2,
    nirfRank: 20,
    established: 1997,
    totalFees4Yr: 680000,
    feePerYear: 170000,
    budgetCategory: "<2L",
    avgPackageLPA: 6.2,
    highestPackageLPA: 42,
    medianPackageLPA: 4.8,
    placementPercent: 90,
    minBoardPercent: 55,
    topRecruiters: ["TCS", "Infosys", "Amazon", "Microsoft", "Deloitte", "Accenture", "Capgemini", "Cognizant", "Oracle", "IBM"],
    campusSize: "400 acres",
    admissionProcess: "KIITEE (KIIT Entrance Exam) / JEE Main",
    hostelFeePerYear: 85000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT", "Biotech"],
    highlights: ["NAAC A++ Grade", "Deemed University", "Strong eastern India presence", "Good hostel facilities", "Sports infrastructure"],
    cutoffs: {
      "JEE Main": { rank: "< 100,000 CRL", percentile: "85+" },
      "KIITEE": { rank: "< 8,000 (ECE for 85%+), < 5,000 (CSE)" },
      "Board %": { min: "60% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "KIITEE": "< 8,000", "JEE Main": "< 100,000" },
      "CSE": { "KIITEE": "< 5,000", "JEE Main": "< 70,000" },
      "Mechanical": { "KIITEE": "< 15,000", "JEE Main": "< 150,000" },
      "Civil": { "KIITEE": "< 20,000", "JEE Main": "< 180,000" },
      "EEE": { "KIITEE": "< 12,000", "JEE Main": "< 120,000" }
    },
    website: "https://kiit.ac.in"
  },
  {
    id: "soa_bbsr",
    name: "Siksha 'O' Anusandhan (SOA)",
    shortName: "SOA",
    location: "Bhubaneswar, Odisha",
    region: "East",
    tier: 3,
    nirfRank: 35,
    established: 1996,
    totalFees4Yr: 520000,
    feePerYear: 130000,
    budgetCategory: "<2L",
    avgPackageLPA: 5.0,
    highestPackageLPA: 25,
    medianPackageLPA: 4.0,
    placementPercent: 82,
    minBoardPercent: 50,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Tech Mahindra", "Capgemini", "IBM", "Mindtree", "L&T"],
    campusSize: "140 acres",
    admissionProcess: "SAT (SOA Admission Test) / JEE Main",
    hostelFeePerYear: 70000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT"],
    highlights: ["Deemed University", "NAAC A Grade", "Affordable fees", "Good for eastern India students"],
    cutoffs: {
      "JEE Main": { rank: "< 200,000 CRL", percentile: "75+" },
      "SAT (SOA)": { rank: "< 15,000 (ECE), < 10,000 (CSE)" },
      "Board %": { min: "55% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "SAT (SOA)": "< 15,000", "JEE Main": "< 200,000" },
      "CSE": { "SAT (SOA)": "< 10,000", "JEE Main": "< 150,000" },
      "Mechanical": { "SAT (SOA)": "< 25,000", "JEE Main": "< 250,000" },
      "Civil": { "SAT (SOA)": "< 30,000", "JEE Main": "< 280,000" }
    },
    website: "https://soa.ac.in"
  },
  {
    id: "manipal_udupi",
    name: "Manipal Institute of Technology",
    shortName: "MIT Manipal",
    location: "Manipal, Karnataka",
    region: "South",
    tier: 1,
    nirfRank: 15,
    established: 1957,
    totalFees4Yr: 1200000,
    feePerYear: 300000,
    budgetCategory: "2-4L",
    avgPackageLPA: 9.0,
    highestPackageLPA: 48,
    medianPackageLPA: 7.2,
    placementPercent: 93,
    minBoardPercent: 60,
    topRecruiters: ["Microsoft", "Amazon", "Google", "Goldman Sachs", "Samsung", "Qualcomm", "Intel", "Adobe", "VMware", "Cisco"],
    campusSize: "600 acres",
    admissionProcess: "MET (Manipal Entrance Test) / JEE Main",
    hostelFeePerYear: 140000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT", "Chemical", "Biotech"],
    highlights: ["Oldest private engineering college", "World-class campus", "Strong alumni network", "Excellent research output"],
    cutoffs: {
      "JEE Main": { rank: "< 60,000 CRL", percentile: "90+" },
      "MET": { rank: "< 10,000 (ECE), < 6,000 (CSE)" },
      "Board %": { min: "65% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "MET": "< 10,000", "JEE Main": "< 65,000" },
      "CSE": { "MET": "< 6,000", "JEE Main": "< 40,000" },
      "Mechanical": { "MET": "< 20,000", "JEE Main": "< 100,000" },
      "Civil": { "MET": "< 25,000", "JEE Main": "< 120,000" },
      "EEE": { "MET": "< 15,000", "JEE Main": "< 80,000" }
    },
    website: "https://manipal.edu"
  },
  {
    id: "thapar_patiala",
    name: "Thapar Institute of Engineering & Technology",
    shortName: "Thapar",
    location: "Patiala, Punjab",
    region: "North",
    tier: 2,
    nirfRank: 28,
    established: 1956,
    totalFees4Yr: 760000,
    feePerYear: 190000,
    budgetCategory: "<2L",
    avgPackageLPA: 7.8,
    highestPackageLPA: 45,
    medianPackageLPA: 6.0,
    placementPercent: 90,
    minBoardPercent: 60,
    topRecruiters: ["Microsoft", "Amazon", "Samsung", "Goldman Sachs", "Flipkart", "TCS", "Infosys", "Adobe", "Deloitte", "EY"],
    campusSize: "250 acres",
    admissionProcess: "JEE Main score based",
    hostelFeePerYear: 95000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "Chemical", "Biotech"],
    highlights: ["Deemed University", "Strong in North India", "Good research output", "Industry-connected curriculum"],
    cutoffs: {
      "JEE Main": { rank: "< 50,000 CRL (CSE), < 70,000 (ECE)", percentile: "90+" },
      "Board %": { min: "60% aggregate" }
    },
    cutoffsByStream: {
      "ECE": { "JEE Main": "< 70,000" },
      "CSE": { "JEE Main": "< 50,000" },
      "Mechanical": { "JEE Main": "< 100,000" },
      "Civil": { "JEE Main": "< 130,000" },
      "EEE": { "JEE Main": "< 85,000" }
    },
    website: "https://www.thapar.edu"
  },
  {
    id: "lpu_punjab",
    name: "Lovely Professional University",
    shortName: "LPU",
    location: "Phagwara, Punjab",
    region: "North",
    tier: 3,
    nirfRank: 45,
    established: 2005,
    totalFees4Yr: 600000,
    feePerYear: 150000,
    budgetCategory: "<2L",
    avgPackageLPA: 5.5,
    highestPackageLPA: 52,
    medianPackageLPA: 4.0,
    placementPercent: 85,
    minBoardPercent: 50,
    topRecruiters: ["Amazon", "TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Capgemini", "Byju's", "Flipkart", "Paytm"],
    campusSize: "600 acres",
    admissionProcess: "LPUNEST (LPU National Entrance & Scholarship Test) / JEE Main / Direct Admission",
    hostelFeePerYear: 80000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT", "Aerospace", "Agriculture"],
    highlights: ["Largest single-campus university in India", "600+ acre campus", "Good scholarship programs", "Diverse student community"],
    cutoffs: {
      "JEE Main": { rank: "< 200,000 CRL", percentile: "75+" },
      "LPUNEST": { rank: "< 20,000 (ECE), < 12,000 (CSE)" },
      "Board %": { min: "55% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "LPUNEST": "< 20,000", "JEE Main": "< 200,000" },
      "CSE": { "LPUNEST": "< 12,000", "JEE Main": "< 150,000" },
      "Mechanical": { "LPUNEST": "< 30,000", "JEE Main": "< 250,000" },
      "Civil": { "LPUNEST": "< 35,000", "JEE Main": "< 280,000" }
    },
    website: "https://www.lpu.in"
  },
  {
    id: "amity_noida",
    name: "Amity University",
    shortName: "Amity",
    location: "Noida, Uttar Pradesh",
    region: "North",
    tier: 3,
    nirfRank: 55,
    established: 2005,
    totalFees4Yr: 720000,
    feePerYear: 180000,
    budgetCategory: "<2L",
    avgPackageLPA: 5.0,
    highestPackageLPA: 35,
    medianPackageLPA: 3.8,
    placementPercent: 80,
    minBoardPercent: 50,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Capgemini", "Accenture", "Tech Mahindra", "IBM", "Genpact"],
    campusSize: "200 acres",
    admissionProcess: "Amity JEE / JEE Main / Direct Admission",
    hostelFeePerYear: 110000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT", "Biotech"],
    highlights: ["Private university", "Good infrastructure", "International tie-ups", "Industry exposure programs"],
    cutoffs: {
      "JEE Main": { rank: "< 250,000 CRL", percentile: "70+" },
      "Amity JEE": { rank: "< 25,000 (ECE), < 15,000 (CSE)" },
      "Board %": { min: "55% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "Amity JEE": "< 25,000", "JEE Main": "< 250,000" },
      "CSE": { "Amity JEE": "< 15,000", "JEE Main": "< 180,000" },
      "Mechanical": { "Amity JEE": "< 35,000", "JEE Main": "< 300,000" },
      "Civil": { "Amity JEE": "< 40,000", "JEE Main": "< 320,000" }
    },
    website: "https://www.amity.edu"
  },
  {
    id: "amrita_coimbatore",
    name: "Amrita Vishwa Vidyapeetham",
    shortName: "Amrita",
    location: "Coimbatore, Tamil Nadu",
    region: "South",
    tier: 2,
    nirfRank: 7,
    established: 2003,
    totalFees4Yr: 680000,
    feePerYear: 170000,
    budgetCategory: "<2L",
    avgPackageLPA: 7.0,
    highestPackageLPA: 44,
    medianPackageLPA: 5.5,
    placementPercent: 90,
    minBoardPercent: 60,
    topRecruiters: ["Amazon", "Microsoft", "Google", "Samsung", "TCS", "Infosys", "Wipro", "Bosch", "L&T", "Cisco"],
    campusSize: "450 acres",
    admissionProcess: "AEEE (Amrita Engineering Entrance Exam) / JEE Main",
    hostelFeePerYear: 90000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "Chemical", "Biotech"],
    highlights: ["NAAC A++ Grade", "Deemed University", "Strong research", "Value-based education", "NIRF Rank 7"],
    cutoffs: {
      "JEE Main": { rank: "< 70,000 CRL", percentile: "88+" },
      "AEEE": { rank: "< 12,000 (ECE), < 7,000 (CSE)" },
      "Board %": { min: "60% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "AEEE": "< 12,000", "JEE Main": "< 75,000" },
      "CSE": { "AEEE": "< 7,000", "JEE Main": "< 50,000" },
      "Mechanical": { "AEEE": "< 20,000", "JEE Main": "< 120,000" },
      "Civil": { "AEEE": "< 25,000", "JEE Main": "< 150,000" },
      "EEE": { "AEEE": "< 15,000", "JEE Main": "< 90,000" }
    },
    website: "https://www.amrita.edu"
  },
  {
    id: "rvce_bangalore",
    name: "RV College of Engineering",
    shortName: "RVCE",
    location: "Bangalore, Karnataka",
    region: "South",
    tier: 2,
    nirfRank: 32,
    established: 1963,
    totalFees4Yr: 900000,
    feePerYear: 225000,
    budgetCategory: "2-4L",
    avgPackageLPA: 8.2,
    highestPackageLPA: 50,
    medianPackageLPA: 6.8,
    placementPercent: 92,
    minBoardPercent: 60,
    topRecruiters: ["Microsoft", "Amazon", "Google", "Samsung", "Qualcomm", "Intel", "Bosch", "Oracle", "TCS", "Infosys"],
    campusSize: "52 acres",
    admissionProcess: "KCET / COMEDK / Management Quota",
    hostelFeePerYear: 100000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT", "Chemical", "Biotech"],
    highlights: ["Top Bangalore college", "Strong placements", "NAAC A+ Grade", "Industry-connected"],
    cutoffs: {
      "KCET": { rank: "< 3,000 (CSE), < 6,000 (ECE)" },
      "COMEDK": { rank: "< 2,500 (CSE), < 5,000 (ECE)" },
      "Board %": { min: "65% (Karnataka)" }
    },
    cutoffsByStream: {
      "ECE": { "KCET": "< 6,000", "COMEDK": "< 5,000" },
      "CSE": { "KCET": "< 3,000", "COMEDK": "< 2,500" },
      "Mechanical": { "KCET": "< 12,000", "COMEDK": "< 10,000" },
      "Civil": { "KCET": "< 18,000", "COMEDK": "< 15,000" }
    },
    website: "https://www.rvce.edu.in"
  },
  {
    id: "psg_coimbatore",
    name: "PSG College of Technology",
    shortName: "PSG Tech",
    location: "Coimbatore, Tamil Nadu",
    region: "South",
    tier: 2,
    nirfRank: 38,
    established: 1951,
    totalFees4Yr: 400000,
    feePerYear: 100000,
    budgetCategory: "<2L",
    avgPackageLPA: 6.5,
    highestPackageLPA: 38,
    medianPackageLPA: 5.0,
    placementPercent: 88,
    minBoardPercent: 60,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Amazon", "Zoho", "HCL", "Cognizant", "L&T", "Bosch", "Caterpillar"],
    campusSize: "45 acres",
    admissionProcess: "TNEA Counselling / Management Quota",
    hostelFeePerYear: 60000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT", "Production", "Automobile"],
    highlights: ["One of oldest private colleges in TN", "Very affordable", "Strong alumni", "Good research"],
    cutoffs: {
      "TNEA": { rank: "< 5,000 (CSE), < 10,000 (ECE)" },
      "Board %": { min: "60% (Tamil Nadu board)" }
    },
    cutoffsByStream: {
      "ECE": { "TNEA": "< 10,000" },
      "CSE": { "TNEA": "< 5,000" },
      "Mechanical": { "TNEA": "< 20,000" },
      "Civil": { "TNEA": "< 30,000" }
    },
    website: "https://www.psgtech.edu"
  },
  {
    id: "chitkara_punjab",
    name: "Chitkara University",
    shortName: "Chitkara",
    location: "Rajpura, Punjab",
    region: "North",
    tier: 3,
    nirfRank: 72,
    established: 2002,
    totalFees4Yr: 600000,
    feePerYear: 150000,
    budgetCategory: "<2L",
    avgPackageLPA: 5.8,
    highestPackageLPA: 42,
    medianPackageLPA: 4.5,
    placementPercent: 85,
    minBoardPercent: 50,
    topRecruiters: ["Amazon", "TCS", "Infosys", "Wipro", "HCL", "Cognizant", "Capgemini", "Accenture", "IBM", "Paytm"],
    campusSize: "50 acres",
    admissionProcess: "Direct Admission / JEE Main score",
    hostelFeePerYear: 85000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT"],
    highlights: ["Good placement record", "Industry partnerships", "Innovation labs", "Affordable"],
    cutoffs: {
      "JEE Main": { rank: "< 250,000 CRL", percentile: "70+" },
      "Board %": { min: "55% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "JEE Main": "< 250,000" },
      "CSE": { "JEE Main": "< 200,000" },
      "Mechanical": { "JEE Main": "< 300,000" }
    },
    website: "https://www.chitkara.edu.in"
  },
  {
    id: "chandigarh_uni",
    name: "Chandigarh University",
    shortName: "CU",
    location: "Mohali, Punjab",
    region: "North",
    tier: 3,
    nirfRank: 48,
    established: 2012,
    totalFees4Yr: 560000,
    feePerYear: 140000,
    budgetCategory: "<2L",
    avgPackageLPA: 5.5,
    highestPackageLPA: 50,
    medianPackageLPA: 4.2,
    placementPercent: 86,
    minBoardPercent: 50,
    topRecruiters: ["Microsoft", "Amazon", "TCS", "Infosys", "Wipro", "Samsung", "HCL", "Cognizant", "Capgemini", "Accenture"],
    campusSize: "200 acres",
    admissionProcess: "CUCET / JEE Main / Direct Admission",
    hostelFeePerYear: 80000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT", "Aerospace"],
    highlights: ["Fastest growing university", "Good placement numbers", "Modern campus", "Research focus"],
    cutoffs: {
      "JEE Main": { rank: "< 200,000 CRL", percentile: "75+" },
      "CUCET": { score: "170+ normalized" },
      "Board %": { min: "55% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "CUCET": "170+", "JEE Main": "< 220,000" },
      "CSE": { "CUCET": "185+", "JEE Main": "< 170,000" },
      "Mechanical": { "CUCET": "150+", "JEE Main": "< 280,000" }
    },
    website: "https://www.cuchd.in"
  },
  {
    id: "woxsen_hyderabad",
    name: "Woxsen University",
    shortName: "Woxsen",
    location: "Hyderabad, Telangana",
    region: "South",
    tier: 3,
    nirfRank: 80,
    established: 2014,
    totalFees4Yr: 1200000,
    feePerYear: 300000,
    budgetCategory: "2-4L",
    avgPackageLPA: 7.0,
    highestPackageLPA: 30,
    medianPackageLPA: 5.5,
    placementPercent: 82,
    minBoardPercent: 55,
    topRecruiters: ["Deloitte", "EY", "KPMG", "Amazon", "TCS", "Infosys", "Wipro", "Accenture", "Capgemini", "IBM"],
    campusSize: "200 acres",
    admissionProcess: "Direct Admission / SAT / JEE Main",
    hostelFeePerYear: 130000,
    streams: ["CSE", "ECE", "Mechanical"],
    highlights: ["New-age university", "Global curriculum", "Industry-immersive learning", "Modern campus"],
    cutoffs: {
      "JEE Main": { rank: "< 250,000 CRL", percentile: "70+" },
      "Board %": { min: "60% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "JEE Main": "< 280,000" },
      "CSE": { "JEE Main": "< 200,000" }
    },
    website: "https://woxsen.edu.in"
  },
  {
    id: "kalinga_bbsr",
    name: "KIMS (Kalinga Institute of Industrial Technology)",
    shortName: "KIIT-DU",
    location: "Bhubaneswar, Odisha",
    region: "East",
    tier: 3,
    nirfRank: 58,
    established: 2004,
    totalFees4Yr: 550000,
    feePerYear: 137500,
    budgetCategory: "<2L",
    avgPackageLPA: 4.8,
    highestPackageLPA: 20,
    medianPackageLPA: 3.5,
    placementPercent: 78,
    minBoardPercent: 45,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Capgemini", "Tech Mahindra", "IBM", "Mindtree"],
    campusSize: "100 acres",
    admissionProcess: "Direct Admission / State Board Merit",
    hostelFeePerYear: 65000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE"],
    highlights: ["Affordable", "Good for Odisha students", "Decent placements"],
    cutoffs: {
      "Board %": { min: "50% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "Board %": "55%" },
      "CSE": { "Board %": "60%" }
    },
    website: "https://kfrm.in"
  },
  {
    id: "galgotias_noida",
    name: "Galgotias University",
    shortName: "Galgotias",
    location: "Greater Noida, UP",
    region: "North",
    tier: 3,
    nirfRank: 90,
    established: 2011,
    totalFees4Yr: 520000,
    feePerYear: 130000,
    budgetCategory: "<2L",
    avgPackageLPA: 4.5,
    highestPackageLPA: 30,
    medianPackageLPA: 3.5,
    placementPercent: 78,
    minBoardPercent: 45,
    topRecruiters: ["TCS", "Infosys", "Wipro", "HCL", "Cognizant", "Capgemini", "Tech Mahindra", "IBM", "Accenture"],
    campusSize: "52 acres",
    admissionProcess: "GUEE / JEE Main / Direct Admission",
    hostelFeePerYear: 75000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT"],
    highlights: ["NCR region", "Affordable", "Good infrastructure", "Sports facilities"],
    cutoffs: {
      "JEE Main": { rank: "< 300,000 CRL", percentile: "65+" },
      "Board %": { min: "50% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "JEE Main": "< 320,000" },
      "CSE": { "JEE Main": "< 250,000" }
    },
    website: "https://www.galgotiasuniversity.edu.in"
  },
  {
    id: "sharda_noida",
    name: "Sharda University",
    shortName: "Sharda",
    location: "Greater Noida, UP",
    region: "North",
    tier: 3,
    nirfRank: 95,
    established: 2009,
    totalFees4Yr: 560000,
    feePerYear: 140000,
    budgetCategory: "<2L",
    avgPackageLPA: 4.2,
    highestPackageLPA: 25,
    medianPackageLPA: 3.2,
    placementPercent: 75,
    minBoardPercent: 45,
    topRecruiters: ["TCS", "Infosys", "Wipro", "HCL", "Cognizant", "IBM", "Capgemini", "Genpact", "Accenture"],
    campusSize: "63 acres",
    admissionProcess: "Direct Admission / University Entrance Test",
    hostelFeePerYear: 80000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT"],
    highlights: ["International students", "NCR location", "Diverse programs"],
    cutoffs: {
      "Board %": { min: "50% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "Board %": "50%" },
      "CSE": { "Board %": "55%" }
    },
    website: "https://www.sharda.ac.in"
  },
  {
    id: "bennett_noida",
    name: "Bennett University",
    shortName: "Bennett",
    location: "Greater Noida, UP",
    region: "North",
    tier: 2,
    nirfRank: 60,
    established: 2016,
    totalFees4Yr: 900000,
    feePerYear: 225000,
    budgetCategory: "2-4L",
    avgPackageLPA: 7.5,
    highestPackageLPA: 42,
    medianPackageLPA: 6.0,
    placementPercent: 88,
    minBoardPercent: 60,
    topRecruiters: ["Microsoft", "Amazon", "Times Group", "TCS", "Infosys", "Samsung", "Wipro", "HCL", "Accenture", "Deloitte"],
    campusSize: "68 acres",
    admissionProcess: "JEE Main / CUET / Direct Admission",
    hostelFeePerYear: 120000,
    streams: ["CSE", "ECE", "Mechanical", "Biotech"],
    highlights: ["Times Group backed", "Modern campus", "Strong CSE department", "Industry mentorship"],
    cutoffs: {
      "JEE Main": { rank: "< 120,000 CRL", percentile: "82+" },
      "Board %": { min: "60% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "JEE Main": "< 140,000" },
      "CSE": { "JEE Main": "< 100,000" }
    },
    website: "https://www.bennett.edu.in"
  },
  {
    id: "sathyabama_chennai",
    name: "Sathyabama Institute of Science & Technology",
    shortName: "Sathyabama",
    location: "Chennai, Tamil Nadu",
    region: "South",
    tier: 3,
    nirfRank: 65,
    established: 1987,
    totalFees4Yr: 500000,
    feePerYear: 125000,
    budgetCategory: "<2L",
    avgPackageLPA: 4.5,
    highestPackageLPA: 22,
    medianPackageLPA: 3.5,
    placementPercent: 80,
    minBoardPercent: 50,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Capgemini", "L&T", "Tech Mahindra"],
    campusSize: "80 acres",
    admissionProcess: "SAEEE / JEE Main / Direct Admission",
    hostelFeePerYear: 70000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT", "Biotech", "Aerospace"],
    highlights: ["Deemed University", "Affordable in Chennai", "ISRO collaboration", "Satellite launch achievement"],
    cutoffs: {
      "JEE Main": { rank: "< 250,000 CRL", percentile: "70+" },
      "SAEEE": { rank: "< 20,000 (ECE), < 12,000 (CSE)" },
      "Board %": { min: "55% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "SAEEE": "< 20,000", "JEE Main": "< 260,000" },
      "CSE": { "SAEEE": "< 12,000", "JEE Main": "< 200,000" }
    },
    website: "https://www.sathyabama.ac.in"
  },
  {
    id: "cv_raman_bbsr",
    name: "C.V. Raman Global University",
    shortName: "CGU",
    location: "Bhubaneswar, Odisha",
    region: "East",
    tier: 3,
    nirfRank: 100,
    established: 1997,
    totalFees4Yr: 440000,
    feePerYear: 110000,
    budgetCategory: "<2L",
    avgPackageLPA: 4.0,
    highestPackageLPA: 18,
    medianPackageLPA: 3.2,
    placementPercent: 75,
    minBoardPercent: 45,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Capgemini", "Tech Mahindra", "Mindtree"],
    campusSize: "40 acres",
    admissionProcess: "Direct Admission / OJEE",
    hostelFeePerYear: 55000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE"],
    highlights: ["Affordable", "Odisha-based", "Growing placement record"],
    cutoffs: {
      "OJEE": { rank: "< 30,000" },
      "Board %": { min: "45% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "OJEE": "< 35,000" },
      "CSE": { "OJEE": "< 25,000" }
    },
    website: "https://www.cvraman.in"
  },
  {
    id: "jis_kolkata",
    name: "JIS University",
    shortName: "JISU",
    location: "Kolkata, West Bengal",
    region: "East",
    tier: 3,
    nirfRank: 110,
    established: 2014,
    totalFees4Yr: 480000,
    feePerYear: 120000,
    budgetCategory: "<2L",
    avgPackageLPA: 4.0,
    highestPackageLPA: 18,
    medianPackageLPA: 3.0,
    placementPercent: 72,
    minBoardPercent: 45,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Capgemini", "Tech Mahindra", "Accenture"],
    campusSize: "20 acres",
    admissionProcess: "WBJEE / JEE Main / Direct Admission",
    hostelFeePerYear: 60000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT"],
    highlights: ["Affordable", "Kolkata-based", "Growing placement record", "Industry tie-ups"],
    cutoffs: {
      "WBJEE": { rank: "< 50,000" },
      "JEE Main": { rank: "< 350,000 CRL", percentile: "60+" },
      "Board %": { min: "50% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "WBJEE": "< 55,000", "JEE Main": "< 380,000" },
      "CSE": { "WBJEE": "< 40,000", "JEE Main": "< 300,000" },
      "Mechanical": { "WBJEE": "< 65,000" },
      "EEE": { "WBJEE": "< 60,000" }
    },
    website: "https://jisuniversity.ac.in"
  },
  {
    id: "uem_kolkata",
    name: "University of Engineering & Management (UEM)",
    shortName: "UEM Kolkata",
    location: "Kolkata, West Bengal",
    region: "East",
    tier: 3,
    nirfRank: 105,
    established: 2008,
    totalFees4Yr: 560000,
    feePerYear: 140000,
    budgetCategory: "<2L",
    avgPackageLPA: 4.5,
    highestPackageLPA: 22,
    medianPackageLPA: 3.5,
    placementPercent: 78,
    minBoardPercent: 50,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Capgemini", "Tech Mahindra", "IBM", "Deloitte"],
    campusSize: "20 acres",
    admissionProcess: "WBJEE / JEE Main / UEMJEE",
    hostelFeePerYear: 70000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT", "Biotech"],
    highlights: ["IEC Group institution", "Strong CSE department", "Industry mentorship", "Modern labs"],
    cutoffs: {
      "WBJEE": { rank: "< 35,000 (CSE), < 45,000 (ECE)" },
      "JEE Main": { rank: "< 280,000 CRL", percentile: "65+" },
      "Board %": { min: "55% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "WBJEE": "< 45,000", "JEE Main": "< 300,000" },
      "CSE": { "WBJEE": "< 35,000", "JEE Main": "< 250,000" },
      "Mechanical": { "WBJEE": "< 55,000" },
      "EEE": { "WBJEE": "< 50,000" }
    },
    website: "https://uem.edu.in"
  },
  {
    id: "techno_india",
    name: "Techno India University",
    shortName: "TIU",
    location: "Kolkata, West Bengal",
    region: "East",
    tier: 3,
    nirfRank: 115,
    established: 2012,
    totalFees4Yr: 440000,
    feePerYear: 110000,
    budgetCategory: "<2L",
    avgPackageLPA: 3.8,
    highestPackageLPA: 16,
    medianPackageLPA: 3.0,
    placementPercent: 70,
    minBoardPercent: 45,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Capgemini", "Tech Mahindra", "Mindtree"],
    campusSize: "10 acres",
    admissionProcess: "WBJEE / JEE Main / Direct Admission",
    hostelFeePerYear: 55000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT"],
    highlights: ["Part of Techno India Group", "Kolkata heart location", "Affordable education", "Industry exposure"],
    cutoffs: {
      "WBJEE": { rank: "< 60,000" },
      "JEE Main": { rank: "< 380,000 CRL", percentile: "55+" },
      "Board %": { min: "45% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "WBJEE": "< 65,000", "JEE Main": "< 400,000" },
      "CSE": { "WBJEE": "< 50,000", "JEE Main": "< 320,000" },
      "Mechanical": { "WBJEE": "< 70,000" }
    },
    website: "https://technoindiauniversity.ac.in"
  },
  {
    id: "adamas_kolkata",
    name: "Adamas University",
    shortName: "Adamas",
    location: "Barasat, West Bengal",
    region: "East",
    tier: 3,
    nirfRank: 120,
    established: 2014,
    totalFees4Yr: 520000,
    feePerYear: 130000,
    budgetCategory: "<2L",
    avgPackageLPA: 4.2,
    highestPackageLPA: 20,
    medianPackageLPA: 3.2,
    placementPercent: 74,
    minBoardPercent: 45,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Capgemini", "IBM", "Accenture"],
    campusSize: "130 acres",
    admissionProcess: "WBJEE / JEE Main / Direct Admission",
    hostelFeePerYear: 65000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT"],
    highlights: ["Large campus near Kolkata", "Modern infrastructure", "Multi-disciplinary university", "Sports facilities"],
    cutoffs: {
      "WBJEE": { rank: "< 55,000" },
      "JEE Main": { rank: "< 350,000 CRL", percentile: "58+" },
      "Board %": { min: "50% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "WBJEE": "< 60,000" },
      "CSE": { "WBJEE": "< 45,000", "JEE Main": "< 300,000" },
      "Mechanical": { "WBJEE": "< 70,000" }
    },
    website: "https://adamasuniversity.ac.in"
  },
  {
    id: "sister_nivedita",
    name: "Sister Nivedita University",
    shortName: "SNU Kolkata",
    location: "Kolkata, West Bengal",
    region: "East",
    tier: 3,
    nirfRank: 130,
    established: 2017,
    totalFees4Yr: 500000,
    feePerYear: 125000,
    budgetCategory: "<2L",
    avgPackageLPA: 3.8,
    highestPackageLPA: 15,
    medianPackageLPA: 3.0,
    placementPercent: 70,
    minBoardPercent: 45,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Capgemini", "Tech Mahindra"],
    campusSize: "5 acres",
    admissionProcess: "WBJEE / JEE Main / Direct Admission",
    hostelFeePerYear: 60000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE"],
    highlights: ["Named after Sister Nivedita", "Growing university", "Focus on women empowerment", "Affordable"],
    cutoffs: {
      "WBJEE": { rank: "< 65,000" },
      "Board %": { min: "45% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "WBJEE": "< 70,000" },
      "CSE": { "WBJEE": "< 55,000" }
    },
    website: "https://snuniv.ac.in"
  },
  {
    id: "brainware_kolkata",
    name: "Brainware University",
    shortName: "Brainware",
    location: "Barasat, West Bengal",
    region: "East",
    tier: 3,
    nirfRank: 135,
    established: 2016,
    totalFees4Yr: 420000,
    feePerYear: 105000,
    budgetCategory: "<2L",
    avgPackageLPA: 3.5,
    highestPackageLPA: 14,
    medianPackageLPA: 2.8,
    placementPercent: 68,
    minBoardPercent: 40,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Capgemini", "Tech Mahindra"],
    campusSize: "15 acres",
    admissionProcess: "WBJEE / Direct Admission",
    hostelFeePerYear: 50000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE"],
    highlights: ["Most affordable in WB", "Part of Brainware Group", "New campus", "Decent placements for the fee"],
    cutoffs: {
      "WBJEE": { rank: "< 75,000" },
      "Board %": { min: "40% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "WBJEE": "< 80,000" },
      "CSE": { "WBJEE": "< 65,000" }
    },
    website: "https://brainwareuniversity.ac.in"
  },
  {
    id: "heritage_kolkata",
    name: "Heritage Institute of Technology",
    shortName: "HITK",
    location: "Kolkata, West Bengal",
    region: "East",
    tier: 2,
    nirfRank: 85,
    established: 2001,
    totalFees4Yr: 560000,
    feePerYear: 140000,
    budgetCategory: "<2L",
    avgPackageLPA: 5.5,
    highestPackageLPA: 30,
    medianPackageLPA: 4.2,
    placementPercent: 82,
    minBoardPercent: 55,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "Amazon", "Capgemini", "Deloitte", "Accenture", "IBM", "EY"],
    campusSize: "18 acres",
    admissionProcess: "WBJEE Counselling / Management Quota",
    hostelFeePerYear: 75000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT"],
    highlights: ["One of top private colleges in WB", "NAAC A Grade", "Strong placements", "Good faculty"],
    cutoffs: {
      "WBJEE": { rank: "< 12,000 (CSE), < 20,000 (ECE)" },
      "Board %": { min: "60% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "WBJEE": "< 20,000" },
      "CSE": { "WBJEE": "< 12,000" },
      "Mechanical": { "WBJEE": "< 30,000" },
      "IT": { "WBJEE": "< 15,000" }
    },
    website: "https://heritageit.edu"
  },
  {
    id: "nshm_kolkata",
    name: "NSHM Knowledge Campus",
    shortName: "NSHM",
    location: "Durgapur/Kolkata, West Bengal",
    region: "East",
    tier: 3,
    nirfRank: 125,
    established: 1996,
    totalFees4Yr: 480000,
    feePerYear: 120000,
    budgetCategory: "<2L",
    avgPackageLPA: 3.8,
    highestPackageLPA: 15,
    medianPackageLPA: 3.0,
    placementPercent: 72,
    minBoardPercent: 45,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Capgemini", "Tech Mahindra"],
    campusSize: "12 acres",
    admissionProcess: "WBJEE / Direct Admission",
    hostelFeePerYear: 55000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE"],
    highlights: ["Multi-campus (Durgapur + Kolkata)", "Affordable", "Industry connections", "Hostel available"],
    cutoffs: {
      "WBJEE": { rank: "< 60,000" },
      "Board %": { min: "45% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "WBJEE": "< 65,000" },
      "CSE": { "WBJEE": "< 50,000" }
    },
    website: "https://nshm.com"
  },
  {
    id: "centurion_bbsr",
    name: "Centurion University of Technology",
    shortName: "CUTM",
    location: "Bhubaneswar/Paralakhemundi, Odisha",
    region: "East",
    tier: 3,
    nirfRank: 98,
    established: 2010,
    totalFees4Yr: 400000,
    feePerYear: 100000,
    budgetCategory: "<2L",
    avgPackageLPA: 3.8,
    highestPackageLPA: 15,
    medianPackageLPA: 3.0,
    placementPercent: 72,
    minBoardPercent: 45,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Capgemini", "Tech Mahindra", "L&T"],
    campusSize: "300 acres",
    admissionProcess: "OJEE / JEE Main / Direct Admission",
    hostelFeePerYear: 50000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "Automobile"],
    highlights: ["Multi-campus university", "Huge campus", "Skill-based education", "Affordable fees"],
    cutoffs: {
      "OJEE": { rank: "< 35,000" },
      "JEE Main": { rank: "< 350,000 CRL", percentile: "55+" },
      "Board %": { min: "45% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "OJEE": "< 40,000" },
      "CSE": { "OJEE": "< 30,000", "JEE Main": "< 300,000" },
      "Mechanical": { "OJEE": "< 45,000" }
    },
    website: "https://cutm.ac.in"
  },
  {
    id: "giet_gunupur",
    name: "GIET University",
    shortName: "GIET",
    location: "Gunupur, Odisha",
    region: "East",
    tier: 3,
    nirfRank: 108,
    established: 2018,
    totalFees4Yr: 360000,
    feePerYear: 90000,
    budgetCategory: "<2L",
    avgPackageLPA: 3.5,
    highestPackageLPA: 12,
    medianPackageLPA: 2.8,
    placementPercent: 68,
    minBoardPercent: 40,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Tech Mahindra", "Mindtree"],
    campusSize: "100 acres",
    admissionProcess: "OJEE / Direct Admission",
    hostelFeePerYear: 45000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE"],
    highlights: ["Very affordable", "Large campus in rural Odisha", "Growing placement record", "Good hostel"],
    cutoffs: {
      "OJEE": { rank: "< 45,000" },
      "Board %": { min: "40% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "OJEE": "< 50,000" },
      "CSE": { "OJEE": "< 40,000" }
    },
    website: "https://gfrm.ac.in"
  },
  {
    id: "trident_bbsr",
    name: "Trident Academy of Technology",
    shortName: "Trident",
    location: "Bhubaneswar, Odisha",
    region: "East",
    tier: 3,
    nirfRank: 112,
    established: 2005,
    totalFees4Yr: 380000,
    feePerYear: 95000,
    budgetCategory: "<2L",
    avgPackageLPA: 3.5,
    highestPackageLPA: 14,
    medianPackageLPA: 2.8,
    placementPercent: 70,
    minBoardPercent: 45,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Capgemini", "Tech Mahindra"],
    campusSize: "10 acres",
    admissionProcess: "OJEE / BPUT Counselling",
    hostelFeePerYear: 50000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE"],
    highlights: ["Bhubaneswar location", "Affiliated to BPUT", "Affordable", "Decent placements"],
    cutoffs: {
      "OJEE": { rank: "< 40,000" },
      "Board %": { min: "45% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "OJEE": "< 45,000" },
      "CSE": { "OJEE": "< 35,000" }
    },
    website: "https://tat.ac.in"
  },
  {
    id: "silicon_bbsr",
    name: "Silicon Institute of Technology",
    shortName: "Silicon",
    location: "Bhubaneswar, Odisha",
    region: "East",
    tier: 2,
    nirfRank: 78,
    established: 2001,
    totalFees4Yr: 480000,
    feePerYear: 120000,
    budgetCategory: "<2L",
    avgPackageLPA: 5.2,
    highestPackageLPA: 28,
    medianPackageLPA: 4.0,
    placementPercent: 82,
    minBoardPercent: 50,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Amazon", "Cognizant", "HCL", "Capgemini", "Accenture", "IBM", "Deloitte"],
    campusSize: "25 acres",
    admissionProcess: "OJEE / JEE Main / Direct",
    hostelFeePerYear: 55000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT"],
    highlights: ["Top private college in Odisha (after KIIT)", "Strong placements", "Good faculty", "NAAC A Grade"],
    cutoffs: {
      "OJEE": { rank: "< 15,000 (CSE), < 22,000 (ECE)" },
      "JEE Main": { rank: "< 200,000 CRL", percentile: "78+" },
      "Board %": { min: "55% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "OJEE": "< 22,000", "JEE Main": "< 220,000" },
      "CSE": { "OJEE": "< 15,000", "JEE Main": "< 180,000" },
      "Mechanical": { "OJEE": "< 30,000" },
      "IT": { "OJEE": "< 18,000" }
    },
    website: "https://silicon.ac.in"
  },
  {
    id: "iter_bbsr",
    name: "ITER (Institute of Technical Education & Research), SOA",
    shortName: "ITER SOA",
    location: "Bhubaneswar, Odisha",
    region: "East",
    tier: 2,
    nirfRank: 35,
    established: 1996,
    totalFees4Yr: 560000,
    feePerYear: 140000,
    budgetCategory: "<2L",
    avgPackageLPA: 5.5,
    highestPackageLPA: 30,
    medianPackageLPA: 4.2,
    placementPercent: 84,
    minBoardPercent: 50,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Amazon", "Cognizant", "HCL", "Capgemini", "L&T", "IBM", "Deloitte"],
    campusSize: "140 acres",
    admissionProcess: "SAT (SOA Admission Test) / JEE Main / OJEE",
    hostelFeePerYear: 70000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT", "Biotech"],
    highlights: ["Engineering wing of SOA University", "Deemed University", "NAAC A Grade", "Strong research", "Good campus"],
    cutoffs: {
      "SAT (SOA)": { rank: "< 10,000 (CSE), < 15,000 (ECE)" },
      "JEE Main": { rank: "< 180,000 CRL", percentile: "80+" },
      "Board %": { min: "55% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "SAT (SOA)": "< 15,000", "JEE Main": "< 200,000" },
      "CSE": { "SAT (SOA)": "< 10,000", "JEE Main": "< 150,000" },
      "Mechanical": { "SAT (SOA)": "< 25,000" },
      "Civil": { "SAT (SOA)": "< 30,000" }
    },
    website: "https://iter.ac.in"
  },
  {
    id: "jit_cuttack",
    name: "Jatni Institute of Technology (JIT)",
    shortName: "JIT",
    location: "Cuttack, Odisha",
    region: "East",
    tier: 3,
    nirfRank: 140,
    established: 2009,
    totalFees4Yr: 320000,
    feePerYear: 80000,
    budgetCategory: "<2L",
    avgPackageLPA: 3.0,
    highestPackageLPA: 10,
    medianPackageLPA: 2.5,
    placementPercent: 60,
    minBoardPercent: 40,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Tech Mahindra"],
    campusSize: "15 acres",
    admissionProcess: "OJEE / Direct Admission",
    hostelFeePerYear: 40000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE"],
    highlights: ["Very affordable", "Budget-friendly option", "Odisha-based"],
    cutoffs: {
      "OJEE": { rank: "< 55,000" },
      "Board %": { min: "40% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "OJEE": "< 60,000" },
      "CSE": { "OJEE": "< 50,000" }
    },
    website: "https://jfrm.in"
  },
  {
    id: "nit_rourkela",
    name: "NIT Rourkela",
    shortName: "NIT RKL",
    location: "Rourkela, Odisha",
    region: "East",
    tier: 1,
    nirfRank: 16,
    established: 1961,
    totalFees4Yr: 600000,
    feePerYear: 150000,
    budgetCategory: "<2L",
    avgPackageLPA: 12.0,
    highestPackageLPA: 55,
    medianPackageLPA: 8.5,
    placementPercent: 92,
    minBoardPercent: 75,
    topRecruiters: ["Google", "Microsoft", "Amazon", "Goldman Sachs", "Samsung", "Intel", "ISRO", "DRDO", "Flipkart", "Oracle"],
    campusSize: "640 acres",
    admissionProcess: "JEE Main + JoSAA Counselling (Government Institute)",
    hostelFeePerYear: 30000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "Chemical", "Mining", "Metallurgy", "Biotech", "IT"],
    highlights: ["NIT - Government funded", "NIRF Rank 16", "World-class research", "Huge campus", "Very affordable for quality"],
    cutoffs: {
      "JEE Main": { rank: "< 15,000 (CSE), < 25,000 (ECE)", percentile: "96+" },
      "Board %": { min: "75% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "JEE Main": "< 25,000 CRL" },
      "CSE": { "JEE Main": "< 15,000 CRL" },
      "Mechanical": { "JEE Main": "< 40,000 CRL" },
      "Civil": { "JEE Main": "< 55,000 CRL" },
      "EEE": { "JEE Main": "< 32,000 CRL" }
    },
    website: "https://nitrkl.ac.in"
  },
  {
    id: "nit_durgapur",
    name: "NIT Durgapur",
    shortName: "NIT DGP",
    location: "Durgapur, West Bengal",
    region: "East",
    tier: 1,
    nirfRank: 22,
    established: 1960,
    totalFees4Yr: 550000,
    feePerYear: 137500,
    budgetCategory: "<2L",
    avgPackageLPA: 10.5,
    highestPackageLPA: 50,
    medianPackageLPA: 7.5,
    placementPercent: 90,
    minBoardPercent: 75,
    topRecruiters: ["Google", "Microsoft", "Amazon", "Samsung", "TCS", "Infosys", "Goldman Sachs", "Flipkart", "Oracle", "Adobe"],
    campusSize: "186 acres",
    admissionProcess: "JEE Main + JoSAA Counselling (Government Institute)",
    hostelFeePerYear: 28000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "Chemical", "IT", "Metallurgy", "Biotech"],
    highlights: ["NIT - Government funded", "Top NIT in East", "Strong alumni", "Excellent research", "Very affordable"],
    cutoffs: {
      "JEE Main": { rank: "< 18,000 (CSE), < 28,000 (ECE)", percentile: "95+" },
      "Board %": { min: "75% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "JEE Main": "< 28,000 CRL" },
      "CSE": { "JEE Main": "< 18,000 CRL" },
      "Mechanical": { "JEE Main": "< 45,000 CRL" },
      "Civil": { "JEE Main": "< 60,000 CRL" },
      "IT": { "JEE Main": "< 22,000 CRL" }
    },
    website: "https://nitdgp.ac.in"
  },
  {
    id: "iiit_bhubaneswar",
    name: "IIIT Bhubaneswar",
    shortName: "IIIT BBS",
    location: "Bhubaneswar, Odisha",
    region: "East",
    tier: 1,
    nirfRank: 52,
    established: 2006,
    totalFees4Yr: 640000,
    feePerYear: 160000,
    budgetCategory: "<2L",
    avgPackageLPA: 9.0,
    highestPackageLPA: 45,
    medianPackageLPA: 7.0,
    placementPercent: 88,
    minBoardPercent: 65,
    topRecruiters: ["Amazon", "Microsoft", "Samsung", "Flipkart", "TCS", "Infosys", "Cognizant", "Deloitte", "Oracle", "Intel"],
    campusSize: "50 acres",
    admissionProcess: "JEE Main + JoSAA / OJEE Special",
    hostelFeePerYear: 45000,
    streams: ["CSE", "ECE", "EEE", "IT"],
    highlights: ["IIIT - Government funded", "Strong in IT/CS", "Good placements", "Research focus"],
    cutoffs: {
      "JEE Main": { rank: "< 25,000 (CSE), < 35,000 (ECE)", percentile: "93+" },
      "Board %": { min: "65% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "JEE Main": "< 35,000 CRL" },
      "CSE": { "JEE Main": "< 25,000 CRL" },
      "IT": { "JEE Main": "< 28,000 CRL" },
      "EEE": { "JEE Main": "< 40,000 CRL" }
    },
    website: "https://iiit-bh.ac.in"
  },
  {
    id: "makaut_kolkata",
    name: "Maulana Abul Kalam Azad University of Technology",
    shortName: "MAKAUT",
    location: "Kolkata, West Bengal",
    region: "East",
    tier: 3,
    nirfRank: 88,
    established: 2004,
    totalFees4Yr: 300000,
    feePerYear: 75000,
    budgetCategory: "<2L",
    avgPackageLPA: 4.0,
    highestPackageLPA: 15,
    medianPackageLPA: 3.0,
    placementPercent: 70,
    minBoardPercent: 45,
    topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Capgemini", "Tech Mahindra"],
    campusSize: "50 acres",
    admissionProcess: "WBJEE Counselling (State University)",
    hostelFeePerYear: 40000,
    streams: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT"],
    highlights: ["State university - very affordable", "Affiliating university for WB colleges", "Government funded", "Budget option"],
    cutoffs: {
      "WBJEE": { rank: "< 40,000 (CSE), < 50,000 (ECE)" },
      "Board %": { min: "45% (General)" }
    },
    cutoffsByStream: {
      "ECE": { "WBJEE": "< 50,000" },
      "CSE": { "WBJEE": "< 40,000" },
      "Mechanical": { "WBJEE": "< 60,000" },
      "IT": { "WBJEE": "< 45,000" }
    },
    website: "https://makautwb.ac.in"
  }
];

// Helper: Format fee as INR
export const formatFee = (amount) => {
  if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
  return amount.toString();
};

// Helper: Get tier label
export const getTierLabel = (marks) => {
  if (marks >= 95) return { tier: "Top Tier", color: "#22c55e" };
  if (marks >= 85) return { tier: "Tier 1", color: "#3b82f6" };
  if (marks >= 70) return { tier: "Tier 2", color: "#f59e0b" };
  return { tier: "Tier 3 / Alternative", color: "#ef4444" };
};

// Main recommendation engine
export const getCollegeRecommendations = (marks, stream, region, budget) => {
  let filtered = [...COLLEGE_DATABASE];

  // Filter by marks / tier
  if (marks >= 95) {
    filtered = filtered.filter(c => c.tier <= 2);
  } else if (marks >= 85) {
    filtered = filtered.filter(c => c.tier <= 2);
  } else if (marks >= 70) {
    filtered = filtered.filter(c => c.tier >= 2);
  } else {
    filtered = filtered.filter(c => c.tier >= 3 || c.minBoardPercent <= marks);
  }

  // Filter by stream
  if (stream && stream !== 'Any') {
    filtered = filtered.filter(c => c.streams.includes(stream));
  }

  // Filter by region
  if (region && region !== 'All India') {
    filtered = filtered.filter(c => c.region === region);
  }

  // Filter by budget
  if (budget) {
    if (budget === '<2L') {
      filtered = filtered.filter(c => c.feePerYear <= 200000);
    } else if (budget === '2-4L') {
      filtered = filtered.filter(c => c.feePerYear <= 400000);
    }
    // >4L shows all
  }

  // Filter by board percentage minimum
  filtered = filtered.filter(c => c.minBoardPercent <= marks);

  // Sort by NIRF rank
  filtered.sort((a, b) => a.nirfRank - b.nirfRank);

  return filtered.slice(0, 10);
};

// Get all colleges for comparison tool
export const getAllColleges = () => COLLEGE_DATABASE;

// Get college by id
export const getCollegeById = (id) => COLLEGE_DATABASE.find(c => c.id === id);

// Streams list
export const STREAMS = ["CSE", "ECE", "EEE", "Mechanical", "Civil", "IT", "Chemical", "Biotech", "Aerospace"];

// Regions
export const REGIONS = ["All India", "North", "South", "East"];

// Budget options
export const BUDGETS = ["<2L", "2-4L", ">4L"];

// Boards
export const BOARDS = ["CBSE", "ICSE", "State Board"];

export default COLLEGE_DATABASE;
