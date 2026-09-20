export interface Paper {
  id: string
  title: string
  authors: string[]
  venue: string
  year: number
  abstract: string
  areas: string[]
  citations: number
  openAccess: boolean
  doi?: string
  relevanceNote?: string
  connectionNote?: string
  connections?: { workspacePages: number; savedPapers: number; projects: number }
}

export interface Journal {
  id: string
  name: string
  scope: string[]
  submissionType: string
  openAccess: boolean
  matchStrength: 'strong' | 'good' | 'moderate'
  matchNote: string
}

export interface Conference {
  id: string
  name: string
  fullName: string
  areas: string[]
  submissionDeadline: string
  conferenceDate: string
  location: string
  matchNote: string
}

export const PAPERS: Paper[] = [
  {
    id: 'p1',
    title: 'Foundation Models for Medical Image Understanding',
    authors: ['Maya Chen', 'Daniel Park', 'Elena Rodriguez'],
    venue: 'Journal of Medical AI Research',
    year: 2026,
    doi: '10.xxxx/jmai.2026.001',
    abstract: 'Recent foundation models have demonstrated strong transfer performance across medical imaging tasks, but their effectiveness in low-resource clinical environments remains underexplored. We present a systematic evaluation of six foundation architectures on fourteen clinical imaging benchmarks, with particular attention to sample efficiency and domain shift resistance across imaging modalities.',
    areas: ['Medical Imaging', 'Computer Vision', 'Foundation Models'],
    citations: 42,
    openAccess: true,
    relevanceNote: 'Strong match · Medical Imaging · Computer Vision',
    connectionNote: 'Connected to 3 papers in your reading list.',
    connections: { workspacePages: 2, savedPapers: 4, projects: 1 },
  },
  {
    id: 'p2',
    title: 'Federated Learning for Privacy-Preserving Clinical AI',
    authors: ['Soo-Jin Kim', 'Aryan Patel', 'Maya Chen'],
    venue: 'NeurIPS',
    year: 2025,
    doi: '10.xxxx/neurips.2025.4521',
    abstract: 'We introduce a federated learning framework designed for multi-institutional clinical AI deployment, addressing both data heterogeneity and regulatory constraints. Our approach achieves within 2.3% of centralized training performance while preserving differential privacy guarantees across 14 hospital networks in a real-world evaluation.',
    areas: ['Federated Learning', 'Privacy', 'Clinical AI'],
    citations: 128,
    openAccess: false,
    relevanceNote: 'Related to your current project',
    connectionNote: 'Frequently cited alongside papers you are reading.',
    connections: { workspacePages: 1, savedPapers: 6, projects: 2 },
  },
  {
    id: 'p3',
    title: 'Efficient Vision Transformers for Clinical Imaging',
    authors: ['Wei Zhang', 'Catherine Thompson'],
    venue: 'MICCAI',
    year: 2025,
    abstract: 'We propose EfficientViT-Med, a vision transformer variant optimized for resource-constrained clinical deployment. Through structured pruning and knowledge distillation from large foundation models, we achieve a 4.2× reduction in inference latency with less than 1.5% accuracy degradation across pathology and radiology benchmarks.',
    areas: ['Computer Vision', 'Transformers', 'Clinical Imaging'],
    citations: 67,
    openAccess: true,
    connectionNote: 'Related through Medical Imaging + Computer Vision',
  },
  {
    id: 'p4',
    title: 'Self-Supervised Pre-training for Medical Image Segmentation',
    authors: ['Elena Rodriguez', 'Liang Liu'],
    venue: 'CVPR',
    year: 2026,
    abstract: 'Self-supervised pre-training has transformed natural image understanding, yet direct transfer to medical segmentation remains challenging due to acquisition heterogeneity and annotation scarcity. We present MedSSL, a contrastive pre-training strategy for volumetric medical images with strong empirical results on five segmentation benchmarks.',
    areas: ['Medical Imaging', 'Self-Supervised', 'Segmentation'],
    citations: 31,
    openAccess: true,
    connectionNote: 'Connected to your segmentation project.',
  },
  {
    id: 'p5',
    title: 'Multimodal Foundation Models in Healthcare',
    authors: ['Daniel Park', 'Maya Chen', 'Kwame Osei'],
    venue: 'Nature Medicine',
    year: 2025,
    abstract: 'We survey the emerging landscape of multimodal foundation models that jointly reason over clinical text, radiology images, pathology slides, and genomic data. Our analysis identifies key alignment challenges and proposes evaluation criteria for clinical deployment readiness across nine healthcare domains.',
    areas: ['Foundation Models', 'Multimodal', 'Healthcare'],
    citations: 205,
    openAccess: false,
    connectionNote: 'Highly cited in your research area.',
  },
  {
    id: 'p6',
    title: 'Low-Resource Medical Image Analysis with Semi-Supervised Methods',
    authors: ['Maya Chen', 'Hiroshi Wei'],
    venue: 'ICCV',
    year: 2025,
    abstract: 'Annotated medical images remain scarce due to the cost and expertise required for expert labeling. We investigate semi-supervised learning regimes where as few as 1% of training examples are labeled, demonstrating competitive performance through teacher-student consistency regularization adapted to volumetric inputs.',
    areas: ['Medical Imaging', 'Low-Resource', 'Semi-Supervised'],
    citations: 19,
    openAccess: true,
    relevanceNote: 'Potentially relevant to your research question',
  },
]

export const JOURNALS: Journal[] = [
  {
    id: 'j1',
    name: 'Journal of Medical AI Research',
    scope: ['Medical Imaging', 'Machine Learning', 'Clinical AI'],
    submissionType: 'Full paper · Short communication · Review',
    openAccess: true,
    matchStrength: 'strong',
    matchNote: 'Strong topic match',
  },
  {
    id: 'j2',
    name: 'International Journal of Computer Vision',
    scope: ['Computer Vision', 'Image Understanding', 'Scene Analysis'],
    submissionType: 'Full paper',
    openAccess: false,
    matchStrength: 'good',
    matchNote: 'Good methodological match',
  },
  {
    id: 'j3',
    name: 'Medical Image Analysis',
    scope: ['Medical Imaging', 'Image Processing', 'Clinical Applications'],
    submissionType: 'Full paper · Short communication',
    openAccess: false,
    matchStrength: 'strong',
    matchNote: 'Strong scope alignment',
  },
]

export const CONFERENCES: Conference[] = [
  {
    id: 'c1',
    name: 'MICCAI 2026',
    fullName: 'Medical Image Computing and Computer Assisted Intervention',
    areas: ['Medical Imaging', 'Computer Vision', 'Clinical AI'],
    submissionDeadline: 'March 2026 — Prototype date',
    conferenceDate: 'September 2026 — Prototype date',
    location: 'Berlin, Germany — Prototype',
    matchNote: 'Primary venue for your research area',
  },
  {
    id: 'c2',
    name: 'CVPR 2026',
    fullName: 'IEEE Conference on Computer Vision and Pattern Recognition',
    areas: ['Computer Vision', 'Machine Learning', 'Foundation Models'],
    submissionDeadline: 'November 2025 — Prototype date',
    conferenceDate: 'June 2026 — Prototype date',
    location: 'Seattle, USA — Prototype',
    matchNote: 'Strong methodological match',
  },
  {
    id: 'c3',
    name: 'NeurIPS 2026',
    fullName: 'Neural Information Processing Systems',
    areas: ['Machine Learning', 'Federated Learning', 'Foundation Models'],
    submissionDeadline: 'May 2026 — Prototype date',
    conferenceDate: 'December 2026 — Prototype date',
    location: 'Vancouver, Canada — Prototype',
    matchNote: 'Good match for federated learning work',
  },
]
