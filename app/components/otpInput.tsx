"use client";
import React, { useState, useRef } from "react";

const OtpInput = ({ length = 6 }: { length?: number }) => {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // if (newOtp.join("").length === length) {
        //     alert(`OTP Submitted: ${newOtp.join("")}`);
        // }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div>
            <div className="flex gap-2" style={{ alignItems: 'center' }}>
                Enter OTP: {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => {
                            if (el) inputRefs.current[index] = el;
                        }}

                        type="text"
                        value={digit}
                        maxLength={1}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl border border-gray-500 rounded-md bg-gray-900 text-white focus:border-blue-500 focus:outline-none"
                    />
                ))}
            </div>
        </div>
    );
};

export default OtpInput;
