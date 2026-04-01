import { db } from "../src/lib/db";
import {
    societies,
    properties,
    leads,
    installmentPlans,
    payments,
    type NewSociety,
    type NewProperty,
    type NewLead,
    type NewInstallmentPlan,
    type NewPayment
} from "../src/lib/db/schema";
import "dotenv/config";

async function main() {
    console.log("🚀 Initializing High-Value Seed for ABH Holdings...");

    try {
        // 1. Seed Societies
        const societiesData: NewSociety[] = [
            { name: "DHA Phase 8", location: "Lahore", totalPlots: 2500 },
            { name: "Bahria Town Phase 7", location: "Rawalpindi/Islamabad", totalPlots: 1200 },
            { name: "Blue World City", location: "Chakri Road", totalPlots: 5000 },
        ];

        const seededSocieties = await db.insert(societies).values(societiesData).returning();
        console.log(`✅ Seeded ${seededSocieties.length} Societies.`);

        // 2. Seed Premium Leads
        const leadsData: NewLead[] = [
            { name: "Sikandar Hayat", phone: "0300-1112223", email: "sikandar@executive.com", source: "Referral", status: "Interested" },
            { name: "Mariam Nawazish", phone: "0321-4445556", email: "mariam@invest.com", source: "Website", status: "New" },
            { name: "Zubair Khan", phone: "0333-7778889", email: "zubair@land.pk", source: "WhatsApp", status: "Interested" },
        ];
        const seededLeads = await db.insert(leads).values(leadsData).returning();

        // 3. Seed Properties (Residential & Commercial)
        const propertiesData: NewProperty[] = [
            {
                societyId: seededSocieties[0].id,
                name: "1 Kanal Residential Plot",
                plotNumber: "Block X - 202",
                location: "DHA Phase 8, Lahore",
                type: "Residential",
                price: 65000000,
                status: "Available"
            },
            {
                societyId: seededSocieties[0].id,
                name: "10 Marla Residential Plot",
                plotNumber: "Block J - 110",
                location: "DHA Phase 8, Lahore",
                type: "Residential",
                price: 32000000,
                status: "Sold Out"
            },
            {
                societyId: seededSocieties[1].id,
                name: "Executive Shop - Ground Floor",
                plotNumber: "Phase 7 - Shop 45",
                location: "Bahria Phase 7, Rawalpindi",
                type: "Commercial",
                price: 85000000,
                status: "Available"
            },
            {
                societyId: seededSocieties[2].id,
                name: "5 Marla Investment Plot",
                plotNumber: "General Block - 88",
                location: "Blue World City",
                type: "Residential",
                price: 1800000,
                status: "Under Construction"
            }
        ];
        const seededProperties = await db.insert(properties).values(propertiesData).returning();
        console.log(`✅ Seeded ${seededProperties.length} Properties.`);

        // 4. Seed Active Installment Plans
        const plansData: NewInstallmentPlan[] = [
            {
                propertyId: seededProperties[1].id, // 10 Marla Sold
                leadId: seededLeads[0].id, // Sikandar
                totalPrice: 32000000,
                downPayment: 8000000,
                totalInstallments: 36,
                monthlyAmount: 666667,
            },
            {
                propertyId: seededProperties[3].id, // 5 Marla Under Construction
                leadId: seededLeads[2].id, // Zubair
                totalPrice: 1800000,
                downPayment: 300000,
                totalInstallments: 24,
                monthlyAmount: 62500,
            }
        ];
        const seededPlans = await db.insert(installmentPlans).values(plansData).returning();
        console.log(`✅ Created ${seededPlans.length} Active Installment Plans.`);

        // 5. Seed Payments (History)
        const paymentsData: NewPayment[] = [
            { planId: seededPlans[0].id, amountPaid: 8000000, paymentMethod: "Bank Transfer", receiptNumber: "ABH-DHA-001" },
            { planId: seededPlans[0].id, amountPaid: 666667, paymentMethod: "Cash", receiptNumber: "ABH-DHA-002" },
            { planId: seededPlans[1].id, amountPaid: 300000, paymentMethod: "Online", receiptNumber: "ABH-BWC-001" },
        ];
        await db.insert(payments).values(paymentsData);
        console.log("✅ Seeded Payment History.");

        console.log("⭐ ABH HOLDINGS SEED COMPLETED SUCCESSFULLY.");
        process.exit(0);
    } catch (error) {
        console.error("❌ SEEDING ERROR:", error);
        process.exit(1);
    }
}

main();
