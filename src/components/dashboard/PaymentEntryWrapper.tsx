"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import AddPaymentModal from "./AddPaymentModal";

interface PlanOption {
    id: string;
    label: string;
}

export default function PaymentEntryWrapper({ activePlans }: { activePlans: PlanOption[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsModalOpen(true)}
                icon={Plus}
                className="shadow-lg shadow-brand-primary/10 transition-transform active:scale-95"
            >
                Record Payment
            </Button>

            <AddPaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                activePlans={activePlans}
            />
        </>
    );
}