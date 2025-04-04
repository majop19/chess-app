import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import supabase from "@/lib/superbase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session || !session?.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    // Vérifier le type du fichier
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Format de fichier non autorisé" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.storage
      .from("image")
      .upload(`users/${session.user.id}`, file, { upsert: true });

    if (error || !data) {
      return NextResponse.json({ error: "Problème lors de l'upload" });
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: data.fullPath,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors du téléchargement" },
      { status: 500 }
    );
  }
}
