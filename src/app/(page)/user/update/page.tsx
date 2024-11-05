// EditProfile.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from "@/app/model/user.model";
import {uploadThumbnailApi} from "@/app/api/user/user.api";
import {modifyUser} from "@/app/service/user/user.service";
interface EditProfileProps {
    user?: User;
}

export default ({user}: Partial<EditProfileProps>) => {
    const router = useRouter();

    // user가 없는 경우 기본값을 설정합니다.
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState(user?.nickname || '');
    const [name, setName] = useState(user?.name || '');
    const [age, setAge] = useState<number | string>(user?.age || '');
    const [tel, setTel] = useState(user?.tel || '');
    const [gender, setGender] = useState(user?.gender || '');
    const [thumbnail, setThumbnail] = useState<File | null>(null);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 에러 체크
        const errors = [];
        if (!username) errors.push("Username은 필수 입력입니다.");
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

        const updatedUser: User = {
            ...user,
            username,
            password: password || user?.password || '',
            nickname,
            name,
            age: typeof age === 'string' ? parseInt(age) : age,
            tel,
            gender,
        };

        if (thumbnail) {
            try {
                const imgIds = await uploadThumbnailApi([thumbnail]);
                updatedUser.imgId = imgIds.length > 0 ? imgIds[0].toString() : user?.imgId;
            } catch (error) {
                console.error('썸네일 업로드 실패:', error);
            }
        }

        try {
            await modifyUser(updatedUser);
            alert('프로필이 성공적으로 수정되었습니다.');
            router.push("/user/profile");
        } catch (error) {
            console.error('정보 수정 실패:', error);
            alert('정보 수정에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const isValidPhoneNumber = (phone: string) => {
        const regex = /^\d{3}-\d{4}-\d{4}$/;
        return regex.test(phone);
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
                        <div className="heading4">프로필 수정</div>
                        <form onSubmit={handleUpdate} className="md:mt-7 mt-4">
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
                                    placeholder="Password (변경 시 입력)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                <label htmlFor="thumbnail-upload" className="button-main">썸네일 수정</label>
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
                                <button type="submit" className="button-main">Update Profile</button>
                            </div>
                        </form>
                    </div>
                    <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
                        <div className="text-content">
                            <div className="heading4">프로필을 확인하세요</div>
                            <div className="mt-2 text-secondary">회원 정보를 수정하고 저장할 수 있습니다.</div>
                            <div className="block-button md:mt-7 mt-4">
                                <button onClick={() => router.push('/user/profile')} className="button-main">Go to Profile</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
