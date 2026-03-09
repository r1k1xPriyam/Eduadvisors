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
