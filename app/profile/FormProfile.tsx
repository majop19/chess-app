"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserNameUpdate } from "./formAction";
import { useRef } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const formSchema = z.object({
  name: z.string().min(3).max(20).optional().or(z.literal("")),
  image: z.optional(
    z
      .instanceof(File, {
        message: "Please select an image file.",
      })
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: `The image is too large. Please choose an image smaller than ${formatBytes(
          MAX_FILE_SIZE
        )}.`,
      })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "Please upload a valid image file (JPEG, JPG , PNG or Webp).",
      })
  ),
});

type FormType = z.infer<typeof formSchema>;

export const FormProfile = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: undefined,
    },
  });

  const handleReset = () => {
    // Réinitialiser le formulaire
    form.reset();

    // Réinitialiser manuellement l'input file
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Efface la valeur de l'input
    }
  };

  const router = useRouter();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Créer un FormData pour envoyer le fichier
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Échec du téléchargement de l'image");
      }

      return response.json();
    },
    onSuccess: () => {
      handleReset();
      router.refresh();
    },
  });

  const onSubmit = async (values: FormType) => {
    if (values.name) {
      const res = await UserNameUpdate(values.name);

      if (res?.serverError) {
        throw new Error(res?.serverError?.serverError);
      }
      router.refresh();
    }
    if (values.image) {
      const file = values.image;

      toast.promise(uploadMutation.mutateAsync(file), {
        loading: "Téléchargement de l'image...",
        success: "Image téléchargée avec succès !",
        error: (err) => `Erreur lors du téléchargement : ${err.message}`,
      });
    }
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      field.onChange(file);
                    }
                  }}
                  ref={fileInputRef}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <Button
          type="submit"
          disabled={uploadMutation.isPending}
          className="cursor-pointer"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};
