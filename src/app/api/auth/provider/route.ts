import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { firebaseAdmin } from "@/lib/firebase-admin";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        // 1. Read token from client
        const body = await req.json();
        const token = body.token;

        if (!token) {
            return NextResponse.json({ error: "Missing token" }, { status: 400 });
        }

        // 2. Verify token with Firebase Admin
        const decoded = await firebaseAdmin.auth().verifyIdToken(token);
        const { email, name, picture, uid, firebase } = decoded;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const provider = firebase.sign_in_provider || "unknown";

        // 3. Upsert user in Neon DB (Prisma)
        await prisma.user.upsert({
            where: { email },
            update: {
                name: name || undefined,
                avatar: picture || undefined,
                firebaseUid: uid,
                provider: provider,
            },
            create: {
                email,
                name,
                avatar: picture,
                firebaseUid: uid,
                provider: provider,
            },
        });

        // 4. Create Session JWT
        const sessionToken = jwt.sign(
            { email, uid, name },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        // 5. Set HTTP-only Cookie
        const cookieStore = await cookies();
        cookieStore.set("session", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            sameSite: "lax",
            path: "/",
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Auth Error:", error);
        return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }
}
