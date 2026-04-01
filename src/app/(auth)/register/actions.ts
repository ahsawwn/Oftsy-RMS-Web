"use server";

import { z } from "zod";
import { AuthService } from "@/lib/auth/auth.service";
import { DBProxy } from "@/lib/db/proxy";
import { redirect } from "next/navigation";

const RegisterSchema = z.object({
    email: z.string().email().toLowerCase().trim(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    superPassword: z.string().min(1, "Super password is required"),
});

export async function registerAction(prevState: any, formData: FormData) {
    const validated = RegisterSchema.safeParse(Object.fromEntries(formData));
    if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

    try {
        // 1. Verify Super User Password
        const isSuperValid = await DBProxy.verifySuperUserPassword(validated.data.superPassword);
        if (!isSuperValid) {
            return { message: "Invalid Master Authorization Key" };
        }

        // 2. Check if user already exists
        const existingUser = await DBProxy.getUserByEmail(validated.data.email);
        if (existingUser) {
            return { message: "Account already exists" };
        }

        // 3. Create New User
        const passwordHash = await AuthService.hashPassword(validated.data.password);
        await DBProxy.registerUser(validated.data.email, passwordHash);

    } catch (e) {
        console.error("REGISTRATION_ERROR:", e);
        return { message: "System failure during onboarding" };
    }

    redirect("/login?registered=true");
}
