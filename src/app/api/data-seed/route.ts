import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { 
    users, societies, properties, leads, 
    installmentPlans, payments, constructionProjects, 
    bankAccounts, officeExpenses, projectLedger, materialProcurement, laborManagement,
    installmentSchedules, authLogs
} from "@/lib/db/schema";
import { AuthService } from "@/lib/auth/auth.service";
import { eq, sql } from "drizzle-orm";

export async function GET() {
    try {
        console.log("🚀 Starting Full ERP Genesis Seed...");

        // 0. Perform a Clean Wipe (Guaranteed order)
        await db.execute(sql`
            DROP TABLE IF EXISTS "office_expenses" CASCADE;
            DROP TABLE IF EXISTS "bank_accounts" CASCADE;
            DROP TABLE IF EXISTS "labor_management" CASCADE;
            DROP TABLE IF EXISTS "material_procurement" CASCADE;
            DROP TABLE IF EXISTS "project_ledger" CASCADE;
            DROP TABLE IF EXISTS "construction_projects" CASCADE;
            DROP TABLE IF EXISTS "transfer_history" CASCADE;
            DROP TABLE IF EXISTS "payments" CASCADE;
            DROP TABLE IF EXISTS "installment_schedules" CASCADE;
            DROP TABLE IF EXISTS "installment_plans" CASCADE;
            DROP TABLE IF EXISTS "leads" CASCADE;
            DROP TABLE IF EXISTS "properties" CASCADE;
            DROP TABLE IF EXISTS "societies" CASCADE;
            DROP TABLE IF EXISTS "sessions" CASCADE;
            DROP TABLE IF EXISTS "auth_logs" CASCADE;
            DROP TABLE IF EXISTS "users" CASCADE;
            DROP TABLE IF EXISTS "audit_logs" CASCADE;

            -- Identity
            CREATE TABLE "users" (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email varchar(255) NOT NULL UNIQUE, password_hash text NOT NULL, created_at timestamp DEFAULT now() NOT NULL);
            CREATE TABLE "sessions" (id text PRIMARY KEY, user_id uuid NOT NULL REFERENCES users(id), expires_at timestamp with time zone NOT NULL);
            CREATE TABLE "auth_logs" (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), event varchar(100) NOT NULL, user_id uuid REFERENCES users(id), ip_address varchar(50), metadata jsonb, created_at timestamp DEFAULT now() NOT NULL);

            -- Inventory
            CREATE TABLE "societies" (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name varchar(255) NOT NULL, location text NOT NULL, total_plots integer NOT NULL, created_at timestamp DEFAULT now() NOT NULL);
            CREATE TABLE "properties" (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), society_id uuid REFERENCES societies(id), name varchar(255) NOT NULL, plot_number varchar(50), location text NOT NULL, type varchar(50) NOT NULL, status varchar(50) DEFAULT 'Available' NOT NULL, price bigint NOT NULL, units integer DEFAULT 1, created_at timestamp DEFAULT now() NOT NULL);

            -- CRM & Recovery
            CREATE TABLE "leads" (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name varchar(255) NOT NULL, email varchar(255), phone varchar(20) NOT NULL, property_id uuid REFERENCES properties(id) ON DELETE SET NULL, status varchar(50) DEFAULT 'New' NOT NULL, source varchar(100), notes text, created_at timestamp DEFAULT now() NOT NULL);
            CREATE TABLE "installment_plans" (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), property_id uuid REFERENCES properties(id) NOT NULL, lead_id uuid REFERENCES leads(id) NOT NULL, total_price bigint NOT NULL, down_payment bigint NOT NULL, total_installments integer NOT NULL, monthly_amount bigint NOT NULL, start_date timestamp DEFAULT now() NOT NULL, status varchar(20) DEFAULT 'Active');
            CREATE TABLE "installment_schedules" (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), plan_id uuid REFERENCES installment_plans(id) NOT NULL, due_date timestamp NOT NULL, amount bigint NOT NULL, status varchar(20) DEFAULT 'Pending', paid_at timestamp);
            CREATE TABLE "payments" (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), plan_id uuid REFERENCES installment_plans(id) NOT NULL, amount_paid bigint NOT NULL, payment_date timestamp DEFAULT now() NOT NULL, method varchar(50), receipt_no varchar(100) UNIQUE);
            CREATE TABLE "transfer_history" (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), property_id uuid REFERENCES properties(id) NOT NULL, old_lead_id uuid REFERENCES leads(id) NOT NULL, new_lead_id uuid REFERENCES leads(id) NOT NULL, transfer_date timestamp DEFAULT now() NOT NULL, transfer_fee bigint NOT NULL);

            -- ERP
            CREATE TABLE "bank_accounts" (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), bank_name varchar(255) NOT NULL, account_no varchar(100) NOT NULL UNIQUE, current_balance bigint NOT NULL DEFAULT 0, created_at timestamp DEFAULT now() NOT NULL);
            CREATE TABLE "office_expenses" (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), category varchar(50) NOT NULL, description text, amount bigint NOT NULL, bank_account_id uuid REFERENCES bank_accounts(id), date timestamp DEFAULT now() NOT NULL);
            CREATE TABLE "construction_projects" (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title varchar(255) NOT NULL, location text NOT NULL, total_budget bigint NOT NULL, status varchar(50) DEFAULT 'Planned', created_at timestamp DEFAULT now() NOT NULL);
            CREATE TABLE "project_ledger" (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid REFERENCES construction_projects(id) NOT NULL, description varchar(255) NOT NULL, type varchar(10) NOT NULL, amount bigint NOT NULL, category varchar(50) NOT NULL, date timestamp DEFAULT now() NOT NULL);
            CREATE TABLE "material_procurement" (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid REFERENCES construction_projects(id) NOT NULL, item varchar(100) NOT NULL, quantity integer NOT NULL, unit varchar(20) NOT NULL, vendor varchar(255), cost_per_unit integer NOT NULL, total_cost bigint NOT NULL, purchased_at timestamp DEFAULT now() NOT NULL);
            CREATE TABLE "labor_management" (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid REFERENCES construction_projects(id) NOT NULL, contractor_name varchar(255) NOT NULL, work_type varchar(100), total_contract_value bigint, paid_to_date bigint DEFAULT 0, attendance_count integer DEFAULT 0, last_activity timestamp DEFAULT now());
        `);

        // 1. Seed Admin
        const hash = await AuthService.hashPassword("admin123");
        await db.insert(users).values({ email: "admin@abhholdings.com", passwordHash: hash });

        // 2. Seed Finance
        const [meezan] = await db.insert(bankAccounts).values([
            { bankName: "Meezan Bank Ltd", accountNumber: "020202938475", currentBalance: 25000000 },
            { bankName: "HBL Corporate", accountNumber: "998822334455", currentBalance: 12000000 }
        ]).returning();

        // 3. Seed Inventory
        const [dha8] = await db.insert(societies).values([{ name: "DHA Phase 8", location: "Lahore", totalPlots: 2500 }]).returning();
        const [plot] = await db.insert(properties).values([{ 
            societyId: dha8.id, name: "1 Kanal Plot", plotNumber: "X-102", location: "DHA Phase 8", 
            type: "Residential", price: 65000000, status: "Sold Out" 
        }]).returning();

        // 4. Seed CRM & Active Plan
        const [lead] = await db.insert(leads).values([{ name: "Chaudhary Arshad", phone: "03214455667", status: "Closed", propertyId: plot.id }]).returning();
        const [plan] = await db.insert(installmentPlans).values([{ 
            propertyId: plot.id, leadId: lead.id, totalPrice: 65000000, downPayment: 15000000, 
            totalInstallments: 36, monthlyAmount: 1388888, status: "Active" 
        }]).returning();

        // 5. Seed Installment Schedule (Next 3 Months)
        await db.insert(installmentSchedules).values([
            { planId: plan.id, dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), amount: 1388888 },
            { planId: plan.id, dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), amount: 1388888 },
            { planId: plan.id, dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), amount: 1388888 }
        ]);

        // 6. Seed Construction Project
        const [villa] = await db.insert(constructionProjects).values([{ 
            title: "ABH Villa 01", location: "DHA Phase 8", totalBudget: 25000000, status: "Structure" 
        }]).returning();
        
        await db.insert(materialProcurement).values([
            { projectId: villa.id, item: "Steel Reinforcement", quantity: 15, unit: "Tons", vendor: "Mughal Steel", costPerUnit: 250000, totalCost: 3750000 },
            { projectId: villa.id, item: "Cement", quantity: 500, unit: "Bags", vendor: "Bestway", costPerUnit: 1250, totalCost: 625000 }
        ]);

        await db.insert(laborManagement).values([{ 
            projectId: villa.id, 
            contractorName: "Master Hanif Structure", 
            workType: "Foundation & Lintel", 
            totalContractValue: 1500000, 
            paidToDate: 500000, 
            attendanceCount: 12 
        }]);

        return NextResponse.json({ success: true, message: "Full ERP Genesis Seed Complete. System fully operational locally." });
    } catch (e: any) {
        console.error("GENESIS_SEED_ERROR:", e);
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
