import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="relative aspect-square bg-white">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.condition === "new"
                ? "bg-yellow-500 text-black"
                : "bg-white text-black"
            }`}>
            {product.condition === "new" ? "Шинэ" : "Хэрэглэсэн"}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-yellow-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground">{product.size}</p>
        <p className="text-lg font-bold text-yellow-500">
          ₮{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
