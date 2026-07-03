import { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-xl border border-ink/20 bg-paper px-4 py-2.5 text-sm outline-none focus:border-terracotta";
const labelClass = "font-mono text-xs uppercase tracking-widest text-ink-soft";

export function ProductForm({
  product,
  action,
}: {
  product?: Product;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex max-w-2xl flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Title</label>
          <input name="title" defaultValue={product?.title} required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Slug</label>
          <input name="slug" defaultValue={product?.slug} required className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Subtitle</label>
        <input name="subtitle" defaultValue={product?.subtitle} required className={inputClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          defaultValue={product?.description}
          required
          rows={4}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Price (USD)</label>
          <input
            name="price"
            type="number"
            step="1"
            defaultValue={product?.price}
            required
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Compare-at</label>
          <input
            name="compareAtPrice"
            type="number"
            step="1"
            defaultValue={product?.compareAtPrice}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Stock</label>
          <input
            name="stock"
            type="number"
            defaultValue={product?.stock ?? 0}
            required
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Accent (hex)</label>
          <input name="accent" defaultValue={product?.accent ?? "#C1531B"} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Category</label>
          <select name="category" defaultValue={product?.category ?? CATEGORIES[0]} className={inputClass}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Status</label>
          <select name="status" defaultValue={product?.status ?? "in_stock"} className={inputClass}>
            <option value="in_stock">in_stock</option>
            <option value="low_stock">low_stock</option>
            <option value="sold_out">sold_out</option>
            <option value="preorder">preorder</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Card size</label>
          <select name="size" defaultValue={product?.size ?? "md"} className={inputClass}>
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Tags (comma-separated)</label>
        <input name="tags" defaultValue={product?.tags.join(", ")} className={inputClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Images (comma-separated paths/URLs)</label>
        <input name="images" defaultValue={product?.images.join(", ")} className={inputClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Variants (JSON, optional)</label>
        <textarea
          name="variants"
          defaultValue={product?.variants ? JSON.stringify(product.variants) : ""}
          rows={2}
          placeholder='[{"label":"Size","options":["S","M"]}]'
          className={inputClass}
        />
      </div>

      <Button type="submit" size="lg" className="self-start">
        {product ? "Save changes" : "Create product"}
      </Button>
    </form>
  );
}
