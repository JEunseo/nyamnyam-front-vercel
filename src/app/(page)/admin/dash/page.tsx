"use client";
import React, {useEffect, useState} from "react";
import Image from 'next/image'
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import {fetchCurrentPost, fetchShowCount} from "src/app/service/admin/admin.service";
import {CountItem, ReportCountModel} from "src/app/model/dash.model";
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from "chart.js";
import styles from "src/css/mypage.module.css";
import {Bar} from "react-chartjs-2";
import ShowOpinion from "src/app/(page)/admin/showOpinion/page";
import DashBoard from "src/app/(page)/admin/dashboard/page";
import {fetchReportCountAll, fetchReportList} from "src/app/service/report/report.service";
import {ReportModel} from "src/app/model/report.model";
import UserList from "@/app/(page)/user/userList/page";
import {fetchAllUsers, fetchUserById} from "@/app/api/user/user.api";
import {User} from "@/app/model/user.model";
import {PostModel} from "@/app/model/post.model";
import nookies from "nookies";

ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale, PointElement, LineElement);


export default function AdminDash() {
    const [count, setCount] = useState<CountItem[]>([]);
    const [activeTab, setActiveTab] = useState<string | undefined>('user')
    const [reportCountList, setReportCountList] = useState<ReportCountModel[]>([]);
    const [reportList, setReportList] = useState<ReportModel[]>([]);
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [userList, setUserList] = useState<User[]>([]);
    const [todayPost, setTodayPost] = useState<PostModel[]>([]);
    const [user, setUser] = useState<User | null>(null);


    const cookie = nookies.get();
    const userId = cookie.userId;


    useEffect(() => {
        const fetchData = async () => {
            const countData = await fetchShowCount();
            setCount(countData);

            const reportData = await fetchReportCountAll();
            setReportCountList(reportData);

            const listData = await fetchReportList();
            setReportList(listData);

            const userData = await fetchAllUsers();
            setUserList(userData);

            const todayData = await fetchCurrentPost();
            setTodayPost(todayData);

            const myInfo = await fetchUserById(userId);
            setUser(myInfo);

        };

        fetchData();
    }, [userId]);



    const countData = {
        labels: count.map(item => item.nickname),
        datasets: [
            {
                label: 'UserRank',
                data: count.map(item => item.count),
                backgroundColor: 'rgb(253,235,216)',
                borderColor: 'rgb(253,158,64)',
                borderWidth: 1,
            }
        ],
    };

    const totalUser = userList.length;
    const totalTodayPost = todayPost.length;


    const handleRowClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };


    return (
        <>
            {user?.role !== 'ADMIN' ? (
                <div className="unauthorized text-center mt-5">
                </div>
                ) : (
            <div className="profile-block md:py-20 py-10 md:px-8 px-4 mt-10">
                <div className="container">
                    <div className="content-main flex gap-y-8 max-md:flex-col w-full">
                        <div className="left md:w-1/3 xl:pr-[3.125rem] lg:pr-[28px] md:pr-[16px]">
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
                                    <div className="name heading6 mt-4 text-center">Tony Nguyen</div>
                                    <div
                                        className="mail heading6 font-normal normal-case text-secondary text-center mt-1">hi.avitex@gmail.com
                                    </div>
                                </div>
                                <div className="menu-tab w-full max-w-none lg:mt-10 mt-6">
                                    <Link href={'#!'} scroll={false}
                                          className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white ${activeTab === 'user' ? 'active' : ''}`}
                                          onClick={() => setActiveTab('user')}>
                                        <Icon.UserCheck size={20}/>
                                        <strong className="heading6">User</strong>
                                    </Link>
                                    <Link href={'#!'} scroll={false}
                                          className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${activeTab === 'post' ? 'active' : ''}`}
                                          onClick={() => setActiveTab('post')}>
                                        <Icon.Note size={20}/>
                                        <strong className="heading6">Post</strong>
                                    </Link>
                                    <Link href={'#!'} scroll={false}
                                          className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${activeTab === 'opinion' ? 'active' : ''}`}
                                          onClick={() => setActiveTab('opinion')}>
                                        <Icon.PaperPlaneTilt size={20}/>
                                        <strong className="heading6">Opinion</strong>
                                    </Link>
                                    <Link href={'#!'} scroll={false}
                                          className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${activeTab === 'dash' ? 'active' : ''}`}
                                          onClick={() => setActiveTab('dash')}>
                                        <Icon.ChartLine size={20}/>
                                        <strong className="heading6">Dashboard</strong>
                                    </Link>
                                    <Link href={'/login'}
                                          className="item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5">
                                        <Icon.SignOut size={20}/>
                                        <strong className="heading6">Logout</strong>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="right w-full pl-2.5">
                            <div
                                className={`tab text-content w-full ${activeTab === 'user' ? 'block' : 'hidden'}`}>
                                <div className="overview grid sm:grid-cols-3 gap-5 mt-7 ">
                                    <div
                                        className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs">
                                        <div className="counter">
                                            <span className="tese">Total user</span>
                                            <h5 className="heading5 mt-1">{totalUser}</h5>
                                        </div>
                                        <Icon.User className='text-4xl'/>
                                    </div>
                                    <div
                                        className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs">
                                        <div className="counter">
                                            <span className="tese">Today post</span>
                                            <h5 className="heading5 mt-1">{totalTodayPost}</h5>
                                        </div>
                                        <Icon.ReceiptX className='text-4xl'/>
                                    </div>
                                    <div
                                        className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs w-full ">
                                        <Link href="/tag/tags">
                                            <div className="counter">
                                                <h5 className="heading5 mt-1">Tag </h5>
                                            </div>
                                        </Link>
                                        <Icon.Tag className='text-4xl'/>
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
                                                    }, animation: {},
                                                }}

                                            />
                                        </div>
                                    </div>
                                    <h6 className="heading6">UserList</h6>
                                    <UserList/>
                                </div>
                            </div>
                            <div
                                className={`tab text-content overflow-hidden w-full h-auto p-7 mt-7 border border-line rounded-xl ${activeTab === 'post' ? 'block' : 'hidden'}`}>

                                <table className="w-full bg-white rounded-lg text-center">
                                    <thead className="bg-[#FDEBD8FF] border-b border-[#FDEBD8FF] text-center">
                                    <tr>
                                        <th scope="col"
                                            className="py-3 text-sm font-bold uppercase text-secondary">신고된 포스팅의 번호
                                        </th>
                                        <th scope="col"
                                            className="py-3 text-sm font-bold uppercase text-secondary">신고횟수
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {reportCountList.map((r, index) => (
                                        <React.Fragment key={r.postId}>
                                            <tr
                                                className="item duration-300 border-b border-gray-200 hover:bg-gray-10 cursor-pointer"
                                                onClick={() => handleRowClick(index)}
                                            >
                                                <td className="py-3">
                                                    <strong className="text-title">{r.postId}</strong>
                                                </td>
                                                <td className="py-3">
                                                    {r.count}
                                                </td>
                                            </tr>
                                            {openIndex === index && (
                                                <>
                                                    <tr>
                                                        <td colSpan={2} className="py-3 pl-8">
                                                            <Link href={`/post/detail/${r.postId}`} className="text-border">
                                                                <div className="bg-gray-100 p-2 rounded text-sm">
                                                                    {r.content}
                                                                </div>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                    {reportList
                                                        .filter(m => m.postId === r.postId) // 현재 postId에 해당하는 이유만 필터링
                                                        .map(m => (
                                                            <tr key={m.reason}>
                                                                <td colSpan={2} className="py-3 pl-8 text-left text-sm">
                                                                    <div>* {m.reason}</div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </>
                                            )}
                                        </React.Fragment>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <div
                                className={`tab_opinion text-content w-full text-center p-7 mt-7 border border-line rounded-xl ${activeTab === 'opinion' ? 'block' : 'hidden'}`}>
                                <h3 className="heading6">의견보기</h3>
                                <div className="mb-10"><ShowOpinion/></div>
                            </div>

                            <div
                                className={`tab text-content overflow-hidden w-full p-7 mt-7 border border-line rounded-xl ${activeTab === 'dash' ? 'block' : 'hidden'}`}>
                                <DashBoard/>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            )}
        </>
    )


}

