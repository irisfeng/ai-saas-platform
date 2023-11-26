import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { OpenAI, Configuration } from "openai";
import dotenv from "dotenv";

// 配置 dotenv
dotenv.config();

// 从环境变量中获取 API 密钥
const apiKey = process.env.OPENAI_API_KEY;

// 检查 API 密钥是否存在
if (!apiKey) {
    throw new Error("API key is not set in the environment variables");
}

// 创建 OpenAI 配置对象
const configuration = new Configuration({
     apiKey: apiKey });

// 初始化 OpenAI 对象
const openai = new OpenAI(configuration);

export async function POST (
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!configuration.apiKey) {
            return new NextResponse(" API Key not Configured", { status: 500 })
        }

        if(!messages) {
            return new NextResponse("Messages are required", { status: 400 });
        }


        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-16k",
            messages
        });

        return NextResponse.json(response.data.choices[0].messages);
    } catch(error) {
        console.log("[CONVERSATION_ERROR", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}