"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ideasApi, categoriesApi, uploadApi } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import toast from "react-hot-toast";
import { Upload, X, Loader2, Save, ArrowLeft, Lock, Unlock } from "lucide-react";
import { Category, Idea } from "@/types";
import { cn } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  problemStatement: z.string().min(20, "Minimum 20 characters"),
  proposedSolution: z.string().min(20, "Minimum 20 characters"),
  description: z.string().min(50, "Minimum 50 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  isPaid: z.boolean().optional().default(false),
  price: z.number().positive().optional().nullable(),
});
type FormData = z.infer<typeof schema>;

export default function EditIdeaPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll().then((r) => r.data.categories as Category[]),
  });

  // Fetch idea details
  const { data: ideaData, isLoading: isLoadingIdea } = useQuery({
    queryKey: ["idea-edit", id],
    queryFn: async () => {
      // First try getBySlug (which often accepts ID on the backend)
      try {
        const res = await ideasApi.getBySlug(id);
        return res.data.idea as Idea;
      } catch {
        // Fallback: search in my ideas
        const res = await ideasApi.getMy({ limit: 100 });
        const idea = (res.data.ideas as Idea[]).find((i) => i.id === id);
        if (idea) return idea;
        throw new Error("Idea not found");
      }
    },
  });

  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isPaid: false },
  });

  useEffect(() => {
    if (ideaData) {
      reset({
        title: ideaData.title,
        problemStatement: ideaData.problemStatement,
        proposedSolution: ideaData.proposedSolution,
        description: ideaData.description,
        categoryId: ideaData.category?.id || (ideaData as any).categoryId || "",
        isPaid: ideaData.isPaid,
        price: ideaData.price,
      });
      setIsPaid(ideaData.isPaid || false);
      if (ideaData.images) {
        setImages(ideaData.images);
      }
    }
  }, [ideaData, reset]);

  useEffect(() => {
    setValue("isPaid", isPaid);
  }, [isPaid, setValue]);

  const updateMutation = useMutation({
    mutationFn: (data: FormData & { images: string[]; status: string }) =>
      ideasApi.update(id, data),
    onSuccess: () => {
      toast.success("Idea updated successfully!");
      router.push("/dashboard/ideas");
    },
    onError: () => toast.error("Failed to update idea"),
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024,
    onDrop: async (files) => {
      if (images.length + files.length > 5) {
        toast.error("Maximum 5 images allowed");
        return;
      }
      setUploading(true);
      try {
        const uploaded = await Promise.all(files.map((f) => uploadApi.uploadImage(f).then((r) => r.data.url)));
        setImages((prev) => [...prev, ...uploaded]);
        toast.success(`${files.length} image(s) uploaded`);
      } catch {
        toast.error("Image upload failed. Using placeholder URL.");
        setImages((prev) => [...prev, `https://images.unsplash.com/photo-${Date.now()}?w=800`]);
      } finally {
        setUploading(false);
      }
    },
  });

  const onSubmit = async (data: FormData) => {
    if (data.isPaid && !data.price) {
      toast.error("Price is required for paid ideas");
      return;
    }
    // We keep the existing status when editing via update endpoint usually
    updateMutation.mutate({ ...data, images, status: ideaData?.status || "DRAFT" });
  };

  if (isLoadingIdea) {
    return (
      <div className="p-6 max-w-3xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Edit Idea</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Update your sustainability idea</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <FormField label="Idea Title *" error={errors.title?.message}>
          <input
            {...register("title")}
            placeholder="A catchy, descriptive title for your idea..."
            className={inputClass(!!errors.title)}
          />
        </FormField>

        {/* Category */}
        <FormField label="Category *" error={errors.categoryId?.message}>
          <select {...register("categoryId")} className={inputClass(!!errors.categoryId)}>
            <option value="">Select a category...</option>
            {categoriesData?.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
            ))}
          </select>
        </FormField>

        {/* Problem Statement */}
        <FormField label="Problem Statement *" error={errors.problemStatement?.message}>
          <textarea
            {...register("problemStatement")}
            rows={3}
            placeholder="Describe the environmental problem this idea addresses..."
            className={cn(inputClass(!!errors.problemStatement), "resize-none")}
          />
        </FormField>

        {/* Proposed Solution */}
        <FormField label="Proposed Solution *" error={errors.proposedSolution?.message}>
          <textarea
            {...register("proposedSolution")}
            rows={3}
            placeholder="How does your idea solve the problem?"
            className={cn(inputClass(!!errors.proposedSolution), "resize-none")}
          />
        </FormField>

        {/* Description */}
        <FormField label="Full Description *" error={errors.description?.message}>
          <textarea
            {...register("description")}
            rows={6}
            placeholder="Provide a detailed explanation of your idea, including implementation steps, expected impact, costs, and any supporting data..."
            className={cn(inputClass(!!errors.description), "resize-none")}
          />
        </FormField>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Images (max 5)
          </label>
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
              isDragActive
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800"
             )}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                <p className="text-sm text-gray-500">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isDragActive ? "Drop images here" : "Drag & drop or click to upload images"}
                </p>
                <p className="text-xs text-gray-400">PNG, JPG up to 5MB each</p>
              </div>
            )}
          </div>

          {images.length > 0 && (
            <div className="flex gap-3 mt-3 flex-wrap">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <Image src={img} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Paid toggle */}
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isPaid ? <Lock className="text-amber-500 w-5 h-5" /> : <Unlock className="text-gray-400 w-5 h-5" />}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Premium Idea</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Charge members to access full content</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPaid(!isPaid)}
              className={cn(
                "relative w-12 h-6 rounded-full transition-colors",
                isPaid ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
              )}
            >
              <span className={cn(
                "absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform",
                isPaid && "translate-x-6"
              )} />
            </button>
          </div>

          {isPaid && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Price (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0.99"
                  placeholder="9.99"
                  className={cn("pl-8", inputClass(!!errors.price))}
                />
              </div>
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isSubmitting || updateMutation.isPending}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm disabled:opacity-50 transition-colors btn-glow"
          >
            {isSubmitting || updateMutation.isPending ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            Save Changes
          </motion.button>
        </div>
      </form>
    </div>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full px-4 py-3 rounded-xl border text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all",
    hasError ? "border-red-400 focus:ring-red-400" : "border-gray-200 dark:border-gray-700"
  );
}
