"use client";

import dotenv from "dotenv";

dotenv.config({ path: `.env.local` });

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";

export default function InputStory() {
    const [story, setStory] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMessage] = useState("");
    const [prompt, setPrompt] = useState('');

    const promptChange = async (e: any) => {
        setErrorMessage("");
        setPrompt(e.target.value);
    }

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (prompt.length <= 0) {
            setErrorMessage("Please enter a prompt");
            return
        }
        setLoading(true);
        setErrorMessage("")
        try {
            const response = await fetch("/api/generate_story", {
                method: "POST",
                body: JSON.stringify({
                    prompt: prompt,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data);
                setStory(data);
                setLoading(false);
            }
            else {
                throw Error(data.error);
            }
        }
        catch (error: any) {
            setErrorMessage(error.message);
            setLoading(false);
        }
    };
    return (
        <>
            <div className="flex flex-row">
                <div className="basis-1/4">
                </div>
                <div className="basis-1/2">
                    <input
                        className="w-full flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm focus:outline-none  sm:text-sm sm:leading-6"
                        placeholder="Describe your story you want"
                        value={prompt}
                        onChange={promptChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                onSubmit(e);
                            }
                        }}
                    ></input>
                </div>
                <div className="basis-1/4 self-center px-2" onClick={onSubmit}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 hover:bg-gray-600 active:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                </div>
            </div >


            {story && !loading && (
                <div>{story}</div>
            )
            }
            {
                loading && (
                    <div className="flex flex-row">
                        <div className="basis-1/4">
                        </div>
                        <div className="basis-1/2">
                            <p className="flex items-center justify-center mt-4">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            </p>
                        </div>
                        <div className="basis-1/4"></div>
                    </div>

                )
            }

            {
                errorMsg ?
                    (
                        <div className="flex flex-row">
                            <div className="basis-1/4">
                            </div>
                            <div className="basis-1/2">
                                <p className="text-sm text-white">
                                    {errorMsg}
                                </p>
                            </div>
                            <div className="basis-1/4"></div>
                        </div>
                    ) : null
            }

        </>

    )
}
