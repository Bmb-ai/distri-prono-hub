import { NextResponse } from "next/server";
import { deleteCard, updateCard } from "@/lib/cards";
import { isAdminRequest } from "@/lib/auth";

function unauthorized() {
  return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!isAdminRequest()) return unauthorized();

  try {
    const body = await request.json();
    const card = await updateCard(params.id, body);
    return NextResponse.json({ card });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  if (!isAdminRequest()) return unauthorized();

  try {
    await deleteCard(params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur serveur." }, { status: 500 });
  }
}
