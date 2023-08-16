import fs from "fs";
import dotenv from "dotenv";
import { createJsonTranslator, createLanguageModel } from "typechat";
import path from "path";
import { Story } from "./schema";
import { StreamingTextResponse, LangChainStream } from "ai";
import { CallbackManager } from "langchain/callbacks";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { HttpsProxyAgent } from 'https-proxy-agent';


dotenv.config({ path: `.env.local` });


const promptTpl = PromptTemplate.fromTemplate(`
输入：小孩子故事的描述，描述如下：{content}。
输出：1. 输出的内容字数限制在500字以内。2.需要按页来构建故事。3. 输出格式为json, 以标题乌鸦喝水的故事为例:
{{
    "title": "乌鸦喝水",
    "pages": [
        "从前，有一只非常口渴的乌鸦。它在林子里飞来飞去，但找不到水喝。最后，它找到了一个装满水的瓶子，但瓶口太窄，它无法伸进去...",
        "乌鸦拾起一块小石头，将其放入瓶子中。水位上升了一点，但还是太低了。",
        "...",
        " 希望你喜欢这个有关乌鸦喝水的故事！"
    ]
}}
`);


export async function POST(req: Request) {
    const { prompt } = await req.json();

    const { stream, handlers } = LangChainStream();


    const model = new OpenAI({
        streaming: true,
        modelName: "gpt-3.5-turbo-16k",
        openAIApiKey: process.env.OPENAI_API_KEY,
        callbackManager: CallbackManager.fromHandlers(handlers),
        verbose: true,
    }, { basePath: 'http://172.27.144.1:7890' });

    const chain = new LLMChain({
        llm: model,
        prompt: promptTpl
    });

    chain.call({
        content: prompt
    }).catch(console.error);
    return new StreamingTextResponse(stream);
}

