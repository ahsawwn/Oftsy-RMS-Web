import { pgTable, uuid, varchar, text, integer, timestamp, boolean, jsonb, pgEnum, bigint } from "drizzle-orm/pg-core";
import { relations, InferSelectModel, InferInsertModel } from "drizzle-orm";

// -------------------------------------------------------------------------
// 1. CORE IDENTITY & AUTHENTICATION
// -------------------------------------------------------------------------

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
    id: text("id").primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
    ipAddress: varchar("ip_address", { length: 50 }),
    userAgent: text("user_agent"),
});


// -------------------------------------------------------------------------
// 2. REAL ESTATE & INVENTORY
// -------------------------------------------------------------------------

export const societies = pgTable("societies", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    location: text("location").notNull(),
    totalPlots: integer("total_plots").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const properties = pgTable("properties", {
    id: uuid("id").primaryKey().defaultRandom(),
    societyId: uuid("society_id").references(() => societies.id),
    name: varchar("name", { length: 255 }).notNull(),
    plotNumber: varchar("plot_number", { length: 50 }),
    location: text("location").notNull(),
    type: varchar("type", { length: 50 }).notNull(), // Typical: Residential, Commercial, Villa
    status: varchar("status", { length: 50 }).notNull().default("Available"), // Available, Sold Out, Under Construction
    price: bigint("price", { mode: "number" }).notNull(), // PKR Total
    units: integer("units").default(1),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// -------------------------------------------------------------------------
// 3. CRM & SALES PIPELINE (RECOVERY)
// -------------------------------------------------------------------------

export const leads = pgTable("leads", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 20 }).notNull(),
    propertyId: uuid("property_id").references(() => properties.id, { onDelete: 'set null' }),
    status: varchar("status", { length: 50 }).notNull().default("New"), // New, Contacted, Interested, Closed
    source: varchar("source", { length: 100 }),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const installmentPlans = pgTable("installment_plans", {
    id: uuid("id").primaryKey().defaultRandom(),
    propertyId: uuid("property_id").references(() => properties.id).notNull(),
    leadId: uuid("lead_id").references(() => leads.id).notNull(),
    totalPrice: bigint("total_price", { mode: "number" }).notNull(),
    downPayment: bigint("down_payment", { mode: "number" }).notNull(),
    totalInstallments: integer("total_installments").notNull(),
    monthlyAmount: bigint("monthly_amount", { mode: "number" }).notNull(),
    startDate: timestamp("start_date").defaultNow().notNull(),
    status: varchar("status", { length: 20 }).default("Active"), // Active, Completed, Defaulted
});

export const installmentSchedules = pgTable("installment_schedules", {
    id: uuid("id").primaryKey().defaultRandom(),
    planId: uuid("plan_id").references(() => installmentPlans.id).notNull(),
    dueDate: timestamp("due_date").notNull(),
    amount: bigint("amount", { mode: "number" }).notNull(),
    status: varchar("status", { length: 20 }).default("Pending"), // Pending, Paid, Overdue
    paidAt: timestamp("paid_at"),
});

export const payments = pgTable("payments", {
    id: uuid("id").primaryKey().defaultRandom(),
    planId: uuid("plan_id").references(() => installmentPlans.id).notNull(),
    amountPaid: bigint("amount_paid", { mode: "number" }).notNull(),
    paymentDate: timestamp("payment_date").defaultNow().notNull(),
    paymentMethod: varchar("method", { length: 50 }),
    receiptNumber: varchar("receipt_no", { length: 100 }).unique(),
});

export const transferHistory = pgTable("transfer_history", {
    id: uuid("id").primaryKey().defaultRandom(),
    propertyId: uuid("property_id").references(() => properties.id).notNull(),
    oldLeadId: uuid("old_lead_id").references(() => leads.id).notNull(),
    newLeadId: uuid("new_lead_id").references(() => leads.id).notNull(),
    transferDate: timestamp("transfer_date").defaultNow().notNull(),
    transferFee: bigint("transfer_fee", { mode: "number" }).notNull(),
});

// -------------------------------------------------------------------------
// 4. THE BUILDER MODULE (CONSTRUCTION)
// -------------------------------------------------------------------------

export const constructionProjects = pgTable("construction_projects", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(), // e.g. ABH Villa 01
    location: text("location").notNull(),
    totalBudget: bigint("total_budget", { mode: "number" }).notNull(),
    status: varchar("status", { length: 50 }).default("Planned"), // Planned, Foundation, Structure, Finishing, Ready
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projectLedger = pgTable("project_ledger", {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").references(() => constructionProjects.id).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    type: varchar("type", { length: 10 }).notNull(), // Credit or Debit
    amount: bigint("amount", { mode: "number" }).notNull(),
    category: varchar("category", { length: 50 }).notNull(), // Material, Labor, Contractor, Other
    date: timestamp("date").defaultNow().notNull(),
});

export const materialProcurement = pgTable("material_procurement", {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").references(() => constructionProjects.id).notNull(),
    item: varchar("item", { length: 100 }).notNull(), // Cement, Bricks, Steel
    quantity: integer("quantity").notNull(),
    unit: varchar("unit", { length: 20 }).notNull(), // Bags, Tons, Nos
    vendor: varchar("vendor", { length: 255 }),
    costPerUnit: integer("cost_per_unit").notNull(),
    totalCost: bigint("total_cost", { mode: "number" }).notNull(),
    purchasedAt: timestamp("purchased_at").defaultNow().notNull(),
});

export const laborManagement = pgTable("labor_management", {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").references(() => constructionProjects.id).notNull(),
    contractorName: varchar("contractor_name", { length: 255 }).notNull(),
    workType: varchar("work_type", { length: 100 }), // Structure, Plumbing, Paint
    totalContractValue: bigint("total_contract_value", { mode: "number" }),
    paidToDate: bigint("paid_to_date", { mode: "number" }).default(0),
    attendanceCount: integer("attendance_count").default(0),
    lastActivity: timestamp("last_activity").defaultNow(),
});

// -------------------------------------------------------------------------
// 5. FINANCE SUITE (CORPORATE LEDGER)
// -------------------------------------------------------------------------

export const bankAccounts = pgTable("bank_accounts", {
    id: uuid("id").primaryKey().defaultRandom(),
    bankName: varchar("bank_name", { length: 255 }).notNull(),
    accountNumber: varchar("account_no", { length: 100 }).notNull().unique(),
    currentBalance: bigint("current_balance", { mode: "number" }).notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const officeExpenses = pgTable("office_expenses", {
    id: uuid("id").primaryKey().defaultRandom(),
    category: varchar("category", { length: 50 }).notNull(), // Salaries, Marketing, Utilities, Personal Withdrawal
    description: text("description"),
    amount: bigint("amount", { mode: "number" }).notNull(),
    bankAccountId: uuid("bank_account_id").references(() => bankAccounts.id),
    date: timestamp("date").defaultNow().notNull(),
});

export const authLogs = pgTable("auth_logs", {
    id: uuid("id").primaryKey().defaultRandom(),
    event: varchar("event", { length: 100 }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }),
    ipAddress: varchar("ip_address", { length: 50 }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// -------------------------------------------------------------------------
// 6. SYSTEM CONFIG & ONBOARDING
// -------------------------------------------------------------------------

export const systemConfig = pgTable("system_config", {
    id: uuid("id").primaryKey().defaultRandom(),
    key: varchar("key", { length: 255 }).notNull().unique(), // e.g. 'super_user_password_hash'
    value: text("value").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const companySettings = pgTable("company_settings", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull().default("ABH HOLDINGS"),
    address: text("address"),
    phone: varchar("phone", { length: 50 }),
    email: varchar("email", { length: 255 }),
    ntn: varchar("ntn", { length: 100 }), // National Tax Number
    logoUrl: text("logo_url"),
    tagline: varchar("tagline", { length: 255 }),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});



// -------------------------------------------------------------------------
// TYPES & INFER MODELS
// -------------------------------------------------------------------------

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Session = InferSelectModel<typeof sessions>;
export type NewSession = InferInsertModel<typeof sessions>;

export type Society = InferSelectModel<typeof societies>;
export type NewSociety = InferInsertModel<typeof societies>;

export type Property = InferSelectModel<typeof properties>;
export type NewProperty = InferInsertModel<typeof properties>;

export type Lead = InferSelectModel<typeof leads>;
export type NewLead = InferInsertModel<typeof leads>;

export type InstallmentPlan = InferSelectModel<typeof installmentPlans>;
export type NewInstallmentPlan = InferInsertModel<typeof installmentPlans>;

export type InstallmentSchedule = InferSelectModel<typeof installmentSchedules>;
export type NewInstallmentSchedule = InferInsertModel<typeof installmentSchedules>;

export type Payment = InferSelectModel<typeof payments>;
export type NewPayment = InferInsertModel<typeof payments>;

export type TransferHistory = InferSelectModel<typeof transferHistory>;
export type NewTransferHistory = InferInsertModel<typeof transferHistory>;

export type ConstructionProject = InferSelectModel<typeof constructionProjects>;
export type NewConstructionProject = InferInsertModel<typeof constructionProjects>;

export type ProjectLedger = InferSelectModel<typeof projectLedger>;
export type NewProjectLedger = InferInsertModel<typeof projectLedger>;

export type MaterialProcurement = InferSelectModel<typeof materialProcurement>;
export type NewMaterialProcurement = InferInsertModel<typeof materialProcurement>;

export type LaborManagement = InferSelectModel<typeof laborManagement>;
export type NewLaborManagement = InferInsertModel<typeof laborManagement>;

export type BankAccount = InferSelectModel<typeof bankAccounts>;
export type NewBankAccount = InferInsertModel<typeof bankAccounts>;

export type OfficeExpense = InferSelectModel<typeof officeExpenses>;
export type NewOfficeExpense = InferInsertModel<typeof officeExpenses>;

export type AuthLog = InferSelectModel<typeof authLogs>;
export type NewAuthLog = InferInsertModel<typeof authLogs>;

export type SystemConfig = InferSelectModel<typeof systemConfig>;
export type NewSystemConfig = InferInsertModel<typeof systemConfig>;

export type CompanySettings = InferSelectModel<typeof companySettings>;
export type NewCompanySettings = InferInsertModel<typeof companySettings>;