import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";

const redis = Redis.fromEnv();
const resend = new Resend(process.env.RESEND_API_KEY);

const WAITLIST_KEY = "waitlist:emails";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already registered
    const isMember = await redis.sismember(WAITLIST_KEY, normalizedEmail);
    if (isMember) {
      return NextResponse.json({ error: "Cet email est déjà inscrit" }, { status: 409 });
    }

    // Store in Redis
    await redis.sadd(WAITLIST_KEY, normalizedEmail);

    // Notify Elliot of new signup
    const count = await redis.scard(WAITLIST_KEY);
    await resend.emails.send({
      from: "Docpilot <onboarding@resend.dev>",
      to: "elliot.tristram@gmail.com",
      subject: `Nouvelle inscription waitlist Docpilot (#${count})`,
      html: `<p><strong>${normalizedEmail}</strong> vient de s'inscrire sur la waitlist.</p><p>Total : ${count} inscrits.</p>`,
    });

    return NextResponse.json({ success: true, message: "Inscrit avec succès !" });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
