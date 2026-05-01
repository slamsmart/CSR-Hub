import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    emailVerified: v.optional(v.number()),
    emailVerifyToken: v.optional(v.string()),
    name: v.string(),
    password: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.string(), // SUPER_ADMIN, ADMIN_PLATFORM, VERIFIKATOR, AUDITOR, PERUSAHAAN, PENGUSUL, DONOR_KOLABORATOR, PUBLIC
    phone: v.optional(v.string()),
    isActive: v.boolean(),
    isSuspended: v.boolean(),
    suspendReason: v.optional(v.string()),
    twoFactorEnabled: v.boolean(),
    twoFactorSecret: v.optional(v.string()),
    lastLoginAt: v.optional(v.number()),
    lastLoginIp: v.optional(v.string()),
    loginAttempts: v.number(),
    lockedUntil: v.optional(v.number()),
    passwordChangedAt: v.optional(v.number()),
    mustChangePassword: v.boolean(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  accounts: defineTable({
    userId: v.id("users"),
    type: v.string(),
    provider: v.string(),
    providerAccountId: v.string(),
    refreshToken: v.optional(v.string()),
    accessToken: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    tokenType: v.optional(v.string()),
    scope: v.optional(v.string()),
    idToken: v.optional(v.string()),
    sessionState: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_provider_and_providerAccountId", ["provider", "providerAccountId"]),

  sessions: defineTable({
    sessionToken: v.string(),
    userId: v.id("users"),
    expires: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    isActive: v.boolean(),
  })
    .index("by_sessionToken", ["sessionToken"])
    .index("by_userId", ["userId"]),

  verificationTokens: defineTable({
    identifier: v.string(),
    token: v.string(),
    expires: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_identifier_and_token", ["identifier", "token"]),

  loginHistory: defineTable({
    userId: v.id("users"),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    location: v.optional(v.string()),
    success: v.boolean(),
    reason: v.optional(v.string()),
  })
    .index("by_userId", ["userId"]),

  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    type: v.string(), // OrgType enum
    description: v.optional(v.string()),
    mission: v.optional(v.string()),
    vision: v.optional(v.string()),
    foundedYear: v.optional(v.number()),
    logo: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    website: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    provinsi: v.optional(v.string()),
    kabupatenKota: v.optional(v.string()),
    kecamatan: v.optional(v.string()),
    kelurahan: v.optional(v.string()),
    kodePos: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    nomorAkta: v.optional(v.string()),
    nomorNPWP: v.optional(v.string()),
    nomorIzin: v.optional(v.string()),
    nomorSKKemenkumham: v.optional(v.string()),
    verificationStatus: v.string(), // VerificationStatus enum
    verifiedAt: v.optional(v.number()),
    verifiedBy: v.optional(v.string()),
    trustScore: v.number(),
    isPublic: v.boolean(),
    isFeatured: v.boolean(),
    totalProposals: v.number(),
    approvedProposals: v.number(),
    totalFundingReceived: v.number(), // stored as number (use smaller units if needed)
    totalBeneficiaries: v.number(),
    projectSuccessRate: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_type", ["type"])
    .index("by_verificationStatus", ["verificationStatus"])
    .index("by_provinsi", ["provinsi"]),

  organizationMembers: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    role: v.string(),
    isActive: v.boolean(),
    joinedAt: v.number(),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_userId", ["userId"])
    .index("by_organizationId_and_userId", ["organizationId", "userId"]),

  companyProfiles: defineTable({
    organizationId: v.id("organizations"),
    industri: v.optional(v.string()),
    ukuranPerusahaan: v.optional(v.string()),
    jumlahKaryawan: v.optional(v.number()),
    pendapatanTahunan: v.optional(v.string()),
    anggaranCSRTahunan: v.optional(v.number()),
    fokusCSR: v.array(v.string()),
    targetSDGs: v.array(v.string()),
    wilayahFokus: v.array(v.string()),
    budgetMinimum: v.optional(v.number()),
    budgetMaksimum: v.optional(v.number()),
    kategoriFokus: v.optional(v.array(v.string())),
    jenisOrganisasiDipilih: v.optional(v.array(v.string())),
    targetDampakMinimum: v.optional(v.number()),
    namaPICCSR: v.optional(v.string()),
    emailPICCSR: v.optional(v.string()),
    teleponPICCSR: v.optional(v.string()),
    jabatanPICCSR: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_organizationId", ["organizationId"]),

  ngoProfiles: defineTable({
    organizationId: v.id("organizations"),
    kategoriUtama: v.array(v.string()),
    targetSDGs: v.array(v.string()),
    wilayahKerja: v.array(v.string()),
    jumlahAnggota: v.optional(v.number()),
    jumlahRelawan: v.optional(v.number()),
    totalBeneficiaries: v.optional(v.number()),
    namaBank: v.optional(v.string()),
    nomorRekening: v.optional(v.string()),
    atasNama: v.optional(v.string()),
    instagram: v.optional(v.string()),
    facebook: v.optional(v.string()),
    twitter: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    youtube: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_organizationId", ["organizationId"]),

  verificationDocuments: defineTable({
    organizationId: v.id("organizations"),
    type: v.string(),
    fileName: v.string(),
    fileUrl: v.string(),
    fileSize: v.optional(v.number()),
    mimeType: v.optional(v.string()),
    isVerified: v.boolean(),
    verifiedAt: v.optional(v.number()),
    verifiedBy: v.optional(v.string()),
    notes: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    uploadedAt: v.number(),
  })
    .index("by_organizationId", ["organizationId"]),

  verificationReviews: defineTable({
    organizationId: v.string(),
    reviewerId: v.id("users"),
    status: v.string(),
    notes: v.optional(v.string()),
    checklistData: v.optional(v.any()),
    reviewedAt: v.number(),
  })
    .index("by_organizationId", ["organizationId"]),

  trustScores: defineTable({
    organizationId: v.id("organizations"),
    score: v.number(),
    previousScore: v.optional(v.number()),
    reason: v.optional(v.string()),
    calculatedAt: v.number(),
  })
    .index("by_organizationId", ["organizationId"]),

  fraudFlags: defineTable({
    organizationId: v.optional(v.id("organizations")),
    proposalId: v.optional(v.id("proposals")),
    flaggedBy: v.optional(v.string()),
    reason: v.string(),
    riskLevel: v.string(),
    isResolved: v.boolean(),
    resolvedBy: v.optional(v.string()),
    resolvedAt: v.optional(v.number()),
    resolvedNotes: v.optional(v.string()),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_proposalId", ["proposalId"]),

  proposals: defineTable({
    nomor: v.string(),
    title: v.string(),
    slug: v.string(),
    summary: v.string(),
    description: v.string(),
    category: v.string(),
    subCategory: v.optional(v.string()),
    sdgTags: v.array(v.string()),
    keywords: v.array(v.string()),
    organizationId: v.id("organizations"),
    createdById: v.id("users"),
    reviewedById: v.optional(v.id("users")),
    provinsi: v.string(),
    kabupatenKota: v.optional(v.string()),
    kecamatan: v.optional(v.string()),
    targetWilayahDetail: v.optional(v.string()),
    isNasional: v.boolean(),
    targetBeneficiaries: v.number(),
    jenisManfaat: v.optional(v.array(v.string())),
    deskripsiPenerima: v.optional(v.string()),
    budgetTotal: v.number(),
    budgetBreakdown: v.any(),
    startDate: v.number(),
    endDate: v.number(),
    durationMonths: v.number(),
    status: v.string(),
    isPublic: v.boolean(),
    isFeatured: v.boolean(),
    aiMatchScore: v.optional(v.number()),
    aiCompletionScore: v.optional(v.number()),
    aiRiskScore: v.optional(v.number()),
    aiSummary: v.optional(v.string()),
    aiTags: v.optional(v.array(v.string())),
    aiAnalyzedAt: v.optional(v.number()),
    fundingTarget: v.number(),
    fundingSecured: v.number(),
    fundingPercentage: v.number(),
    impactMetrics: v.optional(v.any()),
    estimatedImpact: v.optional(v.string()),
    viewCount: v.number(),
    shortlistCount: v.number(),
    submittedAt: v.optional(v.number()),
    approvedAt: v.optional(v.number()),
    rejectedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_provinsi", ["provinsi"])
    .index("by_createdById", ["createdById"])
    .index("by_nomor", ["nomor"])
    .index("by_slug", ["slug"]),

  proposalAttachments: defineTable({
    proposalId: v.id("proposals"),
    type: v.string(),
    fileName: v.string(),
    fileUrl: v.string(),
    fileSize: v.optional(v.number()),
    mimeType: v.optional(v.string()),
    isPublic: v.boolean(),
    uploadedAt: v.number(),
  })
    .index("by_proposalId", ["proposalId"]),

  proposalStatusHistory: defineTable({
    proposalId: v.id("proposals"),
    fromStatus: v.optional(v.string()),
    toStatus: v.string(),
    changedBy: v.string(),
    notes: v.optional(v.string()),
    changedAt: v.number(),
  })
    .index("by_proposalId", ["proposalId"]),

  proposalMilestones: defineTable({
    proposalId: v.id("proposals"),
    title: v.string(),
    description: v.optional(v.string()),
    targetDate: v.number(),
    orderIndex: v.number(),
    isCompleted: v.boolean(),
    completedAt: v.optional(v.number()),
  })
    .index("by_proposalId", ["proposalId"]),

  companyShortlists: defineTable({
    companyOrgId: v.string(),
    proposalId: v.id("proposals"),
    notes: v.optional(v.string()),
    shortlistedAt: v.number(),
  })
    .index("by_companyOrgId", ["companyOrgId"])
    .index("by_proposalId", ["proposalId"])
    .index("by_companyOrgId_and_proposalId", ["companyOrgId", "proposalId"]),

  fundingCommitments: defineTable({
    proposalId: v.id("proposals"),
    companyOrgId: v.string(),
    amount: v.number(),
    status: v.string(),
    isCoFunding: v.boolean(),
    notes: v.optional(v.string()),
    confirmedAt: v.optional(v.number()),
    disbursedAt: v.optional(v.number()),
    transactionRef: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_proposalId", ["proposalId"])
    .index("by_companyOrgId", ["companyOrgId"]),

  coFundingParticipants: defineTable({
    proposalId: v.id("proposals"),
    organizationId: v.id("organizations"),
    commitAmount: v.number(),
    percentage: v.number(),
    status: v.string(),
    joinedAt: v.number(),
    confirmedAt: v.optional(v.number()),
  })
    .index("by_proposalId", ["proposalId"])
    .index("by_organizationId", ["organizationId"]),

  fundingDisbursements: defineTable({
    fundingCommitmentId: v.id("fundingCommitments"),
    amount: v.number(),
    disbursedAt: v.number(),
    transactionRef: v.optional(v.string()),
    notes: v.optional(v.string()),
    buktiTransfer: v.optional(v.string()),
  })
    .index("by_fundingCommitmentId", ["fundingCommitmentId"]),

  projects: defineTable({
    proposalId: v.id("proposals"),
    kodeProyek: v.string(),
    name: v.string(),
    status: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    progressFisik: v.number(),
    progressKeuangan: v.number(),
    anggaranTotal: v.number(),
    realisasiAnggaran: v.number(),
    sisaAnggaran: v.optional(v.number()),
    picNama: v.optional(v.string()),
    picTelepon: v.optional(v.string()),
    picEmail: v.optional(v.string()),
    lastMonitoringAt: v.optional(v.number()),
    nextMonitoringAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_proposalId", ["proposalId"])
    .index("by_status", ["status"])
    .index("by_kodeProyek", ["kodeProyek"]),

  projectMilestones: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
    targetDate: v.number(),
    orderIndex: v.number(),
    isCompleted: v.boolean(),
    completedAt: v.optional(v.number()),
    progressPct: v.number(),
    evidence: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  })
    .index("by_projectId", ["projectId"]),

  projectReports: defineTable({
    projectId: v.id("projects"),
    reportType: v.string(),
    reportingPeriod: v.string(),
    title: v.string(),
    summary: v.string(),
    progressFisik: v.number(),
    progressKeuangan: v.number(),
    realisasiAnggaran: v.number(),
    pencapaian: v.optional(v.string()),
    kendala: v.optional(v.string()),
    rencanaTindakLanjut: v.optional(v.string()),
    attachments: v.optional(v.array(v.string())),
    isSubmitted: v.boolean(),
    submittedAt: v.optional(v.number()),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.string()),
    reviewNotes: v.optional(v.string()),
  })
    .index("by_projectId", ["projectId"]),

  impactMetrics: defineTable({
    projectId: v.optional(v.id("projects")),
    proposalId: v.optional(v.id("proposals")),
    metricName: v.string(),
    metricValue: v.number(),
    metricUnit: v.string(),
    metricType: v.string(),
    targetValue: v.optional(v.number()),
    achievementPct: v.optional(v.number()),
    period: v.optional(v.string()),
    description: v.optional(v.string()),
    recordedAt: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_proposalId", ["proposalId"]),

  auditReports: defineTable({
    projectId: v.id("projects"),
    auditorId: v.id("users"),
    auditDate: v.number(),
    auditType: v.string(),
    status: v.string(),
    findings: v.optional(v.string()),
    recommendations: v.optional(v.string()),
    complianceStatus: v.string(),
    checklistData: v.optional(v.any()),
    attachments: v.optional(v.array(v.string())),
    score: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_auditorId", ["auditorId"]),

  sustainabilityReports: defineTable({
    companyOrgId: v.string(),
    year: v.number(),
    title: v.string(),
    executiveSummary: v.optional(v.string()),
    totalDanaCSR: v.optional(v.number()),
    totalProyek: v.optional(v.number()),
    totalPenerima: v.optional(v.number()),
    totalOrganisasi: v.optional(v.number()),
    sdgAchievements: v.optional(v.any()),
    categoryBreakdown: v.optional(v.any()),
    chartsData: v.optional(v.any()),
    status: v.string(),
    publishedAt: v.optional(v.number()),
    pdfUrl: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_companyOrgId", ["companyOrgId"])
    .index("by_year", ["year"]),

  sustainabilityReportProjects: defineTable({
    sustainabilityReportId: v.id("sustainabilityReports"),
    projectId: v.id("projects"),
  })
    .index("by_sustainabilityReportId", ["sustainabilityReportId"])
    .index("by_projectId", ["projectId"]),

  messages: defineTable({
    proposalId: v.optional(v.id("proposals")),
    senderId: v.id("users"),
    receiverId: v.optional(v.id("users")),
    threadId: v.optional(v.string()),
    subject: v.optional(v.string()),
    content: v.string(),
    isRead: v.boolean(),
    readAt: v.optional(v.number()),
    isSystem: v.boolean(),
    attachments: v.optional(v.array(v.string())),
  })
    .index("by_proposalId", ["proposalId"])
    .index("by_senderId", ["senderId"])
    .index("by_receiverId", ["receiverId"])
    .index("by_threadId", ["threadId"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    data: v.optional(v.any()),
    isRead: v.boolean(),
    readAt: v.optional(v.number()),
    actionUrl: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_isRead", ["isRead"]),

  auditLogs: defineTable({
    userId: v.optional(v.id("users")),
    action: v.string(),
    resource: v.string(),
    resourceId: v.optional(v.string()),
    oldValue: v.optional(v.any()),
    newValue: v.optional(v.any()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    metadata: v.optional(v.any()),
  })
    .index("by_userId", ["userId"])
    .index("by_resource", ["resource"])
    .index("by_resourceId", ["resourceId"]),

  regions: defineTable({
    code: v.string(),
    name: v.string(),
    type: v.string(),
    parentCode: v.optional(v.string()),
    isActive: v.boolean(),
  })
    .index("by_code", ["code"])
    .index("by_type", ["type"])
    .index("by_parentCode", ["parentCode"]),

  platformSettings: defineTable({
    key: v.string(),
    value: v.string(),
    type: v.string(),
    group: v.optional(v.string()),
    label: v.optional(v.string()),
    updatedBy: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_key", ["key"]),

  successStories: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    organizationId: v.optional(v.string()),
    projectId: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    isPublished: v.boolean(),
    publishedAt: v.optional(v.number()),
    viewCount: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_isPublished", ["isPublished"]),
});
