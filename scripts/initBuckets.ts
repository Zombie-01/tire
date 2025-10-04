import { initializeStorageBucket } from "@/lib/storage";

const buckets = ["images", "brand-logos", "product-images", "banners"];

async function run() {
  for (const bucket of buckets) {
    await initializeStorageBucket(bucket);
  }
  console.log("All buckets initialized");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
