import "dotenv/config";
if (!global.crypto) {
    const { crypto } = require('node:crypto');
    // @ts-ignore
    global.crypto = crypto;
}
import { db } from "./index";

import { 
    users, 
    properties, 
    leads, 
    installmentPlans, 
    payments, 
    authLogs, 
    societies, 
    bankAccounts, 
    constructionProjects,
    systemConfig,
    type NewUser,
    type NewProperty, 
    type NewLead, 
    type NewInstallmentPlan, 
    type NewPayment,
    type NewSociety,
    type NewBankAccount,
    type NewConstructionProject
} from "./schema";
import { AuthService } from "../auth/auth.service";

// Helper to generate a unique suffix to avoid constraint violations during re-seeds
const uid = () => Math.random().toString(36).substring(2, 7).toUpperCase();

export async function seedDatabase(): Promise<void> {
    console.log("🚀 Starting Comprehensive Data Seed for Oftsy RMS...");

    try {
        // 1. Setup Super User Password for and Admin Account
        console.log("🔐 Setting up system configurations...");
        const superUserHash = await AuthService.hashPassword("ABH-ADMIN-2026"); // Default Super Password
        const adminPasswordHash = await AuthService.hashPassword("admin123");

        await db.insert(systemConfig).values({
            key: "super_user_password_hash",
            value: superUserHash
        }).onConflictDoUpdate({
            target: systemConfig.key,
            set: { value: superUserHash }
        });

        const [adminUser] = await db.insert(users).values({
            email: "admin@oftsy.com",
            passwordHash: adminPasswordHash,
        }).onConflictDoNothing().returning();

        const allUsers = await db.select().from(users).limit(1);
        const activeAdminId = adminUser?.id || allUsers[0]?.id;

        console.log("✅ Admin credentials and Super Password ready.");

        // 2. Societies
        const societiesData: NewSociety[] = [
            { name: "Blue World City", location: "Chakri Road, Rawalpindi", totalPlots: 5000 },
            { name: "Kingdom Valley", location: "M-2 Motorway, Islamabad", totalPlots: 3500 },
        ];
        const seededSocieties = await db.insert(societies).values(societiesData).onConflictDoNothing().returning();
        const finalSocieties = seededSocieties.length > 0 ? seededSocieties : await db.select().from(societies).limit(2);
        console.log(`✅ Societies prepared.`);

        // 3. Properties
        const propertiesData: NewProperty[] = [
            {
                societyId: finalSocieties[0].id,
                name: "General Block - Plot 122",
                plotNumber: `122-G-${uid()}`,
                location: "Sector A",
                type: "Residential",
                price: 2500000,
                status: "Available"
            },
            {
                societyId: finalSocieties[1].id,
                name: "Executive Block - Villa 10",
                plotNumber: `V-10-${uid()}`,
                location: "Main Boulevard",
                type: "Villa",
                price: 15000000,
                status: "Available"
            },
        ];
        const seededProperties = await db.insert(properties).values(propertiesData).onConflictDoNothing().returning();
        const finalProperties = seededProperties.length > 0 ? seededProperties : await db.select().from(properties).limit(2);
        console.log(`✅ Properties prepared.`);

        // 4. Leads & CRM
        const leadsData: NewLead[] = [
            {
                name: "Kamran Akmal",
                phone: `0300${Math.floor(Math.random() * 10000000)}`,
                email: `kamran-${uid()}@test.com`,
                propertyId: finalProperties[0].id,
                status: "Interested",
                source: "Facebook"
            },
            {
                name: "Sara Khan",
                phone: `0321${Math.floor(Math.random() * 10000000)}`,
                email: `sara-${uid()}@test.com`,
                status: "New",
                source: "Website"
            }
        ];
        const seededLeads = await db.insert(leads).values(leadsData).onConflictDoNothing().returning();
        const finalLeads = seededLeads.length > 0 ? seededLeads : await db.select().from(leads).limit(2);
        console.log(`✅ Leads prepared.`);

        // 5. Installment Plans & Payments
        const planData: NewInstallmentPlan = {
            propertyId: finalProperties[0].id,
            leadId: finalLeads[0].id,
            totalPrice: 2500000,
            downPayment: 500000,
            totalInstallments: 24,
            monthlyAmount: 83333,
            status: "Active"
        };
        const [activePlan] = await db.insert(installmentPlans).values(planData).onConflictDoNothing().returning();
        
        const existingPlan = activePlan || (await db.select().from(installmentPlans).limit(1))[0];

        if (existingPlan) {
            const paymentsData: NewPayment[] = [
                {
                    planId: existingPlan.id,
                    amountPaid: 500000,
                    paymentMethod: "Bank Transfer",
                    receiptNumber: `REC-BW-${uid()}`
                },
                {
                    planId: existingPlan.id,
                    amountPaid: 83333,
                    paymentMethod: "Cash",
                    receiptNumber: `REC-BW-${uid()}`
                }
            ];
            await db.insert(payments).values(paymentsData).onConflictDoNothing();
            console.log("✅ Installment plan and payments seeded.");
        }

        // 6. Construction Projects
        const projectsData: NewConstructionProject[] = [
            {
                title: "Oftsy Headquarters",
                location: "Blue Area, Islamabad",
                totalBudget: 50000000,
                status: "Foundation"
            }
        ];
        await db.insert(constructionProjects).values(projectsData).onConflictDoNothing();
        console.log("✅ Construction project seeded.");

        // 7. Finance
        const bankData: NewBankAccount[] = [
            {
                bankName: "Meezan Bank",
                accountNumber: `PK12MEZN${uid()}${uid()}`,
                currentBalance: 5000000
            }
        ];
        await db.insert(bankAccounts).values(bankData).onConflictDoNothing();
        console.log("✅ Bank account seeded.");

        // 8. Audit Log record
        if (activeAdminId) {
            await db.insert(authLogs).values({
                userId: activeAdminId,
                event: "SYSTEM_INITIALIZED",
                ipAddress: "127.0.0.1",
                metadata: { version: "1.0.4", status: "Gold" }
            });
        }

        console.log("⭐ COMPREHENSIVE SEEDING SUCCESSFUL!");
    } catch (error) {
        console.error("❌ SEEDING FAILED:", error);
        throw error;
    }
}

// Execute the seed!
seedDatabase().catch((err) => {
    console.error("Fatal Seeding Error:", err);
    process.exit(1);
}).then(() => {
    process.exit(0);
});