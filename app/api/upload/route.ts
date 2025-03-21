import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getAuthSession } from "@/lib/auth";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();

    // Vérifier si l'utilisateur est connecté
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer l'utilisateur depuis la base de données
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
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

    // Convertir le fichier en buffer pour Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload vers Cloudinary en utilisant une promise
    const cloudinaryUpload = () => {
      return new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "auto",
              folder: `users/${user.id}/uploads`,
            },
            (error, result) => {
              if (error) {
                reject(error);
                return;
              }
              resolve(result);
            }
          )
          .end(buffer);
      });
    };

    const result = await cloudinaryUpload();

    const ImageCrop = cloudinary.url(result.public_id, {
      // crop l'image en carré
      crop: "fill",
      gravity: "auto",
      width: 500,
      height: 500,
      quality: "auto:good",
      fetch_format: "auto",
    });
    // Stocker les informations de l'image dans la base de données
    const image = await prisma.image.create({
      data: {
        url: ImageCrop,
        publicId: result.public_id,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        userId: user.id, // Associer l'image à l'utilisateur
      },
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        image: image.id,
      },
    });

    return NextResponse.json({ message: "Image Téléchargé" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors du téléchargement" },
      { status: 500 }
    );
  }
}
