import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

let cached: MongooseCache = (global as unknown as { mongoose?: MongooseCache })
  .mongoose as MongooseCache;

if (!cached) {
  cached = ((global as Record<string, unknown>).mongoose = {
    conn: null,
    promise: null,
  }) as MongooseCache;
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
