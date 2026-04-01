"use client";

import { useState } from "react";
import { CreditCard, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/Button";
import BookingModal from "@/components/dashboard/BookingModal";

interface PropertyDetailClientProps {
    propertyId: string;
    propertyName: string;
    propertyPrice: number;
    leads: any[];
}

export default function PropertyDetailClient({ 
    propertyId, 
    propertyName, 
    propertyPrice,
    leads 
}: PropertyDetailClientProps) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    return (
        <>
            <Button 
                onClick={() => setIsBookingOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest px-4 h-8 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-all border-none"
            >
                Execute Booking <ArrowRight size={12} className="ml-2" />
            </Button>

            <BookingModal 
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                propertyId={propertyId}
                propertyName={propertyName}
                propertyPrice={propertyPrice}
                leads={leads}
            />
        </>
    );
}
