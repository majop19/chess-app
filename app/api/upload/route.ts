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
        imageCloudinary: true,
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

    // Définir un type pour les options d'upload
    type CloudinaryUploadOptions = {
      resource_type: "image" | "auto" | "video" | "raw" | undefined;
      folder?: string;
      overwrite: boolean;
      public_id?: string;
      invalidate: boolean; // Noter le ? qui indique que cette propriété est optionnelle
    };

    // Initialiser les options avec les valeurs obligatoires
    const uploadOptions: CloudinaryUploadOptions = {
      resource_type: "image",
      overwrite: true,
      invalidate: true,
    };

    // Ajouter le public_id seulement s'il existe déjà
    if (user.imageCloudinary?.publicId) {
      uploadOptions.public_id = user.imageCloudinary.publicId;
    } else {
      // Sinon, définir seulement le dossier pour un nouveau upload
      uploadOptions.folder = `users/${user.id}/uploads`;
    }
    // Upload vers Cloudinary en utilisant une promise

    const cloudinaryUpload = () => {
      return new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(uploadOptions, (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          })
          .end(buffer);
      });
    };
    console.log("avant upload", user.imageCloudinary);
    const result = await cloudinaryUpload();
    console.log("upload", result);

    const ImageCrop = cloudinary.url(result.public_id, {
      // crop l'image en carré
      crop: "fill",
      gravity: "auto",
      width: 500,
      height: 500,
      quality: "auto:good",
      fetch_format: "auto",
      version: result.version,
    });
    console.log("image crop", ImageCrop);

    // Stocker les informations de l'image dans la base de données
    await prisma.image.upsert({
      where: {
        userId: user.id,
      },
      update: {
        url: ImageCrop,
        publicId: result.public_id, // Met à jour le publicId même si l'image est écrasé
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      },
      create: {
        url: ImageCrop,
        publicId: result.public_id,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        userId: user.id,
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
