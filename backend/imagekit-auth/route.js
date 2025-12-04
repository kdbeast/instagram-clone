import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    const authParams = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
    });

    return Response.json({
      authParams,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
    });
  } catch (error) {
    return Response.json({ error: error.message }, 500);
  }
}
