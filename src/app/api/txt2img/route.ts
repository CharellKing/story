import dotenv from "dotenv";
import fs from "fs";
import Replicate from "replicate";
import { NextResponse } from "next/server";
import { createLanguageModel, createJsonTranslator, processRequests } from "typechat";
import path from "path";

dotenv.config({ path: `.env.local` });

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const model = createLanguageModel(process.env);
  const schema = fs.readFileSync(path.join(__dirname, "coffeeShopSchema.ts"), "utf8");
  const translator = createJsonTranslator<Cart>(model, schema, "Cart");


  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN || "",
  });
  try {
    const output = await replicate.run(
      "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      {
        input: {
          prompt,
        },
      }
    );
    return NextResponse.json(output);
  }
  catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

}
