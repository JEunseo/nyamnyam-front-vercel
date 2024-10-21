"use client";
import React, {useEffect, useState} from "react";
import {fetchInsertOpinion} from "@/app/service/opinion/opinion.serivce";
import Image from 'next/image'
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import {fetchShowCount} from "@/app/service/admin/admin.service";
import {fetchShowFollower, fetchShowFollowing} from "@/app/service/follow/follow.service";
import {Area, CountItem, RestaurantList, UserPostModel} from "@/app/model/dash.model";
import {OpinionModel} from "@/app/model/opinion.model";
import {ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from "chart.js";
import styles from "@/css/mypage.module.css";
import {Bar, Doughnut} from "react-chartjs-2";
import MyCalendar from "@/app/(page)/user/calendar/[id]/page";
import MyWallet from "@/app/(page)/user/wallet/[id]/page";
import nookies from "nookies";
import {fetchPostList} from "@/app/service/post/post.service";
import {useSearchContext} from "@/app/components/SearchContext";
import {usePathname, useRouter} from "next/navigation";
import UserDash from "@/app/(page)/user/dashBoard/[id]/page";
import {FollowModel} from "@/app/model/follow.model";
import {fetchUserById} from "@/app/api/user/user.api";
import {User} from "@/app/model/user.model";
import followList from "@/app/(page)/user/follow/page";
import FollowList from "@/app/(page)/user/follow/page";


ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale);

export default function MyPage() {
    const [count, setCount] = useState<CountItem[]>([]);
    const [restaurant, setRestaurant] = useState<RestaurantList[]>([]);
    const [post, setPost] = useState<UserPostModel[]>([]);
    const [activeTab, setActiveTab] = useState<string | undefined>('myPage')
    const [user, setUser] = useState<User | null>(null);
    const [follower, setFollower] = useState<FollowModel[]>([]);
    const [following, setFollowing] = useState<FollowModel[]>([]);


    const {searchTerm} = useSearchContext();
    const router = useRouter();
    const pathname = usePathname();
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const cookies = nookies.get();
    const userId = cookies.userId;

    const id = pathname?.split('/')[3];


    useEffect(() => {
        const fetchUser = async () => {
            const userData = await fetchUserById(userId); // await 추가
            setUser(userData);
        };

        fetchUser();

        if (userId) {
            const fetchData = async () => {
                const countData = await fetchShowCount();
                setCount(countData);

                const postData = await fetchPostList(userId);
                setPost(postData);
            };
            fetchData();

            const countList = async () => {
                const data = await fetchShowCount();
                setCount(data);
            };
            countList();

            setIsInitialLoad(false);
        }
    }, [userId]);

    useEffect(() => {
        const follow = async () => {
            if (user?.nickname) {
                const data1 = await fetchShowFollower(user.nickname);
                const data2 = await fetchShowFollowing(user.nickname);
                setFollower(data1);
                setFollowing(data2);
            }
        };

        follow();
    }, [user]);


    const totalFollower = follower.length;

    useEffect(() => {
        if (searchTerm && !isInitialLoad) {
            router.push(`/?search=${searchTerm}`);
        }
    }, [searchTerm]);


    const [content, setContent] = useState("");

    const currentDate = new Date().toISOString();

    const submit = async (content: string) => {
        const report: OpinionModel = {
            id: Date.now(),
            userId,
            content,
            entryDate: currentDate,
        };

        try {
            const result = await fetchInsertOpinion(report);
            if (result) {
                alert('의견이 성공적으로 제출되었습니다.');
                setContent(""); // Clear the textarea after submission
            } else {
                alert('의견 제출에 실패하였습니다.');
            }
        } catch (error) {
            console.error('오류가 발생했습니다:', error);
            alert('의견 제출 중 오류가 발생했습니다.');
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (window.confirm("냠냠에 의견을 보낼까요?")) {
            submit(content);
        }
    };

    const countData = {
        labels: count.map(item => item.nickname),
        datasets: [
            {
                label: 'UserRank',
                data: count.map(item => item.count),
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            }
        ],
    };


    const restaurantData = {
        labels: restaurant.map(item => item.restaurantName),
        datasets: [{

            label: 'RestaurantRank',
            data: restaurant.map(item => item.total),
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
        }],
    };

    const totalPost = post.length;

    if (!userId || id !== userId) {
        return (
            <div className="unauthorized text-center mt-5">
                <h2>잘못된 접근입니다</h2>
                <p>해당 페이지에 접근할 수 없습니다.</p>
            </div>
        );
    }

    return (
        <>

            <div className="profile-block md:py-20 py-10 mt-10">
                <div className="container">
                    <div className="content-main flex gap-y-8 max-md:flex-col w-full">
                        <div className="left md:w-1/3 w-full xl:pr-[3.125rem] lg:pr-[28px] md:pr-[16px]">
                            <div
                                className="user-infor bg-surface lg:px-7 px-4 lg:py-10 py-5 md:rounded-[20px] rounded-xl">
                                <div className="heading flex flex-col items-center justify-center">
                                    <div className="avatar">
                                        <Image
                                            src={'/assets/img/profile.png'}
                                            width={300}
                                            height={300}
                                            alt='avatar'
                                            className='md:w-[140px] w-[120px] md:h-[140px] h-[120px] rounded-full'
                                        />
                                    </div>
                                    <div className="name heading6 mt-4 text-center">{user?.nickname}</div>
                                    <div
                                        className="mail heading6 font-normal normal-case text-secondary text-center mt-1">hi.avitex@gmail.com
                                    </div>
                                </div>
                                <div className="menu-tab w-full max-w-none lg:mt-10 mt-6">
                                    <Link href={'#!'} scroll={false}
                                          className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white ${activeTab === 'myPage' ? 'active' : ''}`}
                                          onClick={() => setActiveTab('myPage')}>
                                        <Icon.HouseLine size={20}/>
                                        <strong className="heading6">MyPage</strong>
                                    </Link>
                                    <Link href={'#!'} scroll={false}
                                          className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${activeTab === 'myWallet' ? 'active' : ''}`}
                                          onClick={() => setActiveTab('myWallet')}>
                                        <Icon.Wallet size={20}/>
                                        <strong className="heading6">MyWallet</strong>
                                    </Link>
                                    <Link href={'#!'} scroll={false}
                                          className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${activeTab === 'follow' ? 'active' : ''}`}
                                          onClick={() => setActiveTab('follow')}>
                                        <Icon.User size={20}/>
                                        <strong className="heading6">MyFollow</strong>
                                    </Link>
                                    <Link href={'#!'} scroll={false}
                                          className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${activeTab === 'dash' ? 'active' : ''}`}
                                          onClick={() => setActiveTab('dash')}>
                                        <Icon.ChartDonut size={20}/>
                                        <strong className="heading6">Dashboard</strong>
                                    </Link>
                                    <Link href={'#!'} scroll={false}
                                          className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${activeTab === 'opinion' ? 'active' : ''}`}
                                          onClick={() => setActiveTab('opinion')}>
                                        <Icon.Clipboard size={20}/>
                                        <strong className="heading6">MyOpinion</strong>
                                    </Link>
                                    <Link href={'#!'} scroll={false}
                                          className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${activeTab === 'edit' ? 'active' : ''}`}
                                          onClick={() => setActiveTab('edit')}>
                                        <Icon.Clipboard size={20}/>
                                        <strong className="heading6">Edit</strong>
                                    </Link>
                                    <Link href={'/login'}
                                          className="item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5">
                                        <Icon.SignOut size={20}/>
                                        <strong className="heading6">Logout</strong>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="right md:w-2/3 w-full pl-2.5">
                            <div
                                className={`tab text-content w-full ${activeTab === 'myPage' ? 'block' : 'hidden'}`}>
                                <div className="overview grid sm:grid-cols-3 gap-5 mt-7 ">
                                    <div
                                        className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs w-full ">
                                        <Link href="/receipt/insertReceipt">
                                            <div className="counter">
                                                <span className="tese text-orange-700">Receipt</span>
                                                <h5 className="heading5 mt-1">insert</h5>
                                            </div>
                                        </Link>
                                        <Icon.Barcode className='text-4xl'/>
                                    </div>
                                    <div
                                        className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs">
                                        <div className="counter">
                                            <span className="tese">Total Post</span>
                                            <h5 className="heading5 mt-1">{totalPost}</h5>
                                        </div>
                                        <Icon.NotePencil className='text-4xl'/>
                                    </div>
                                    <div
                                        className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs">
                                        <div className="counter">
                                            <span className="tese">MY FOLLOWER</span>
                                            <h5 className="heading5 mt-1">{totalFollower}</h5>
                                        </div>
                                        <Icon.UserCircle className='text-4xl'/>
                                    </div>
                                </div>
                                <div className="recent_order pt-5 px-5 pb-2 mt-7 border border-line rounded-xl">
                                    <div>
                                        <div className={styles.cardHeader}>TOTAL POST USER RANKING</div>
                                        <div></div>
                                    </div>
                                    <div className={styles.cardBody}>
                                        <div className={styles.chartContainer}>
                                            <Bar
                                                data={countData}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    scales: {
                                                        x: {title: {display: true, text: 'Nickname'}},
                                                        y: {title: {display: true, text: 'Count'}},
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <h6 className="heading6"> MY POST </h6>
                                    <div className="list overflow-x-auto w-full mt-5">
                                        <table
                                            className="w-full max-[1400px]:w-[700px] max-md:w-[700px] text-center text-sm">
                                            <thead className="border-b border-line">
                                            <tr className="text-center">
                                                <th scope="col"
                                                    className="pb-3 text-sm font-bold uppercase text-secondary whitespace-nowrap">음식점
                                                </th>
                                                <th scope="col"
                                                    className="pb-3 text-sm font-bold uppercase text-secondary whitespace-nowrap">내용
                                                </th>
                                                <th scope="col"
                                                    className="pb-3 text-sm font-bold uppercase text-secondary whitespace-nowrap">작성날짜
                                                </th>
                                                <th scope="col"
                                                    className="pb-3 text-sm font-bold uppercase text-secondary whitespace-nowrap">좋아요
                                                    수
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {post.map(p => (
                                                <tr key={p.postId}
                                                    className="item duration-300 border-b border-line h-auto">
                                                    <Link className=" text-sm text-secondary"
                                                          href={`/restaurant/${p.restaurantId}`}>
                                                        <th scope="row"
                                                            className="py-3 whitespace-nowrap overflow-hidden text-ellipsis">
                                                                <span
                                                                    className="tag px-4 py-1.5 rounded-full bg-orange-100 text-orange font-semibold text-sm">
                                                                      {p.name}
                                                                </span>
                                                        </th>
                                                    </Link>
                                                    <td className="py-3 text-left">
                                                        <div className="info flex flex-col font-bold text-sm">
                                                            {p.content}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 price">
                                                        {new Date(p.entryDate).toISOString().slice(0, 19).replace('T', ' ')}
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="info flex flex-col">
                                                            {p.upvoteCount}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`tab text-content overflow-hidden w-full h-auto p-7 mt-7 border border-line rounded-xl ${activeTab === 'myWallet' ? 'block' : 'hidden'}`}>
                                <h6 className="heading6">My Wallet</h6>
                                <div className="mb-10"><MyCalendar/></div>
                                <div><MyWallet/></div>
                            </div>
                            <div
                                className={`tab text-content overflow-hidden w-full p-7 mt-7 border border-line rounded-xl ${activeTab === 'follow' ? 'block' : 'hidden'}`}>
                                <h6 className="heading6">Follow</h6>
                                <FollowList/>
                            </div>
                            <div
                                className={`tab text-content overflow-hidden w-full p-7 mt-7 border border-line rounded-xl ${activeTab === 'dash' ? 'block' : 'hidden'}`}>
                                <h6 className="heading6">DashBoard</h6>
                                <UserDash/>
                            </div>
                            <div
                                className={`tab text-content overflow-hidden w-full p-7 mt-7 border border-line rounded-xl ${activeTab === 'opinion' ? 'block' : 'hidden'}`}>
                                <h6 className="heading6">My Opinion</h6>
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">냠냠에 전하고 싶은 의견이 있나요?</h2>
                                <h2 className="text-md text-gray-600 mb-4">00님의 소중한 의견을 꼼꼼히 읽어볼게요</h2>
                                <form onSubmit={handleSubmit}>
                             <textarea
                                 value={content}
                                 onChange={(e) => setContent(e.target.value)}
                                 placeholder="여기에 의견을 남겨주세요"
                                 rows={4}
                                 className="w-full border border-gray-300 rounded-md p-2 mb-2"
                                 style={{borderBottom: '2px solid #ccc', marginBottom: '10px'}}
                             />
                                    <button
                                        type="submit"
                                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                                    >제출
                                    </button>
                                </form>
                            </div>
                            <div
                                className={`tab text-content overflow-hidden w-full p-7 mt-7 border border-line rounded-xl ${activeTab === 'edit' ? 'block' : 'hidden'}`}>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )


}

