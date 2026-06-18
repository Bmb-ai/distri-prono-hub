import { NextResponse } from "next/server";
import { createCard, getAllCards } from "@/lib/cards";
import { isAdminRequest } from "@/lib/auth";

function unauthorized() {
  return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
}

export async function GET() {
  if (!isAdminRequest()) return unauthorized();

  try {
    const cards = await getAllCards();
    return NextResponse.json({ cards });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdminRequest()) return unauthorized();

  try {
    const body = await request.json();
    const card = await createCard(body);
    return NextResponse.json({ card });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur serveur." }, { status: 500 });
  }
}
