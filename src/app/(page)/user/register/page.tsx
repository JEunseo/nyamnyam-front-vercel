"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { addUser } from "@/app/service/user/user.service";

export default function Register() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState<number | string>('');
    const [tel, setTel] = useState('');
    const [gender, setGender] = useState('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);

    const isValidPhoneNumber = (phone: string) => {
        const regex = /^\d{3}-\d{4}-\d{4}$/;
        return regex.test(phone);
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = [];

        if (!username) errors.push("Username은 필수 입력입니다.");
        if (!password) errors.push("Password는 필수 입력입니다.");
        if (!nickname) errors.push("Nickname은 필수 입력입니다.");
        if (!name) errors.push("Name은 필수 입력입니다.");
        if (!age) errors.push("Age는 필수 입력입니다.");
        if (!tel) errors.push("전화번호는 필수 입력입니다.");
        if (!gender) errors.push("성별은 필수 입력입니다.");
        if (!isValidPhoneNumber(tel)) {
            errors.push('전화번호는 000-0000-0000 형식이어야 합니다.');
        }

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        try {
            const newUser = await addUser(username, password, nickname, name, age, tel, gender, thumbnail ? [thumbnail] : []);
            console.log('User registered:', newUser);
            router.push("/user/login");
        } catch (error) {
            console.error('Registration failed:', error);
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setThumbnail(event.target.files[0]);
        }
    };

    return (
        <div className="register-block md:py-20 py-10 mt-10" style={{ borderRadius: '20px', overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
            <div className="container">
                <div className="content-main flex gap-y-8 max-md:flex-col p-5">
                    <div className="left md:w-1/2 w-full lg:pr-[60px] md:pr-[40px] md:border-r border-line">
                        <div className="heading4">Register</div>
                        <form onSubmit={handleRegister} className="md:mt-7 mt-4">
                            <div className="email">
                                <input
                                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                    id="username"
                                    type="text"
                                    placeholder="Username *"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="pass mt-5">
                                <input
                                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                    id="password"
                                    type="password"
                                    placeholder="Password *"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="nickname mt-5">
                                <input
                                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                    id="nickname"
                                    type="text"
                                    placeholder="Nickname *"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="name mt-5">
                                <input
                                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                    id="name"
                                    type="text"
                                    placeholder="Name *"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="age mt-5">
                                <input
                                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                    id="age"
                                    type="number"
                                    placeholder="Age *"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="tel mt-5">
                                <input
                                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                    id="tel"
                                    type="text"
                                    placeholder="전화번호 (000-0000-0000) *"
                                    value={tel}
                                    onChange={(e) => setTel(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="gender mt-5">
                                <select
                                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    required
                                >
                                    <option value="">성별 선택</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="thumbnails mt-5">
                                <label htmlFor="thumbnail-upload" className="button-main">썸네일 추가</label>
                                <input
                                    type="file"
                                    id="thumbnail-upload"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                {thumbnail && <p>{thumbnail.name} 선택됨</p>}
                            </div>
                            <div className="block-button md:mt-7 mt-4">
                                <button type="submit" className="button-main">Register</button>
                            </div>
                        </form>
                    </div>
                    <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
                        <div className="text-content">
                            <div className="heading4">Already have an account?</div>
                            <div className="mt-2 text-secondary">Welcome back. Sign in to access your personalized experience, saved preferences, and more. We're thrilled to have you with us again!</div>
                            <div className="block-button md:mt-7 mt-4">
                                <Link href={'/login'} className="button-main">Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
