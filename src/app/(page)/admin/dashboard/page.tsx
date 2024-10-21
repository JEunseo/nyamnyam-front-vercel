"use client";
import React, {useEffect, useState} from "react";
import {Bar, Doughnut, Line} from "react-chartjs-2";
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
} from "chart.js"; // ArcElement 추가
import styles from "src/css/mypage.module.css";
import {
    fetchReceiptList,
    fetchShowArea,
    fetchShowRestaurant,
    fetchUpvoteRestaurant
} from "src/app/service/admin/admin.service";
import {Area, CountCost, CountItem, RestaurantList} from "src/app/model/dash.model";
import {User} from "@/app/model/user.model";
import nookies from "nookies";
import {fetchUserById} from "@/app/api/user/user.api";


ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale, PointElement, LineElement);
const DashBoard = () => {
    const [count, setCount] = useState<CountItem[]>([]);
    const [region, setRegion] = useState<Area[]>([]);
    const [restaurant, setRestaurant] = useState<RestaurantList[]>([]);
    const [countRestaurant, setCountRestaurant] = useState<CountCost[]>([]);
    const [upvoteRestaurant, setUpvoteRestaurant] = useState<RestaurantList[]>([]);
    const [user, setUser] = useState<User | null>(null);

    const cookie = nookies.get();
    const userId = cookie.userId;

    useEffect(() => {
        const list = async () => {
            const regionData = await fetchShowArea();
            setRegion(regionData);

            const restaurantData = await fetchShowRestaurant();
            setRestaurant(restaurantData);

            const countCosts = await fetchReceiptList();
            setCountRestaurant(countCosts);

            const data = await fetchUpvoteRestaurant();
            setUpvoteRestaurant(data);

            const myInfo = await fetchUserById(userId);
            setUser(myInfo);

        };
        list();
    }, []);


    const areaData = {
        labels: region.map(item => item.area),
        datasets: [{
            data: region.map(item => item.total),
            backgroundColor: ["#F46119", "#ed6d2b", "#f37f48", "#ea966d", "#EAB5A0FF"],
            borderColor: ["#fff", "#fff", "#fff", "#fff", "#fff"],
            borderWidth: 1,
        }],
    };

    const upvoteData = {
        labels: upvoteRestaurant.map(item => item.restaurantName),
        datasets: [{
            data: upvoteRestaurant.map(item => item.total),
            backgroundColor: ["#F46119", "#ed6d2b", "#f37f48", "#ea966d", "#EAB5A0FF"],
            borderColor: ["#fff", "#fff", "#fff", "#fff", "#fff"],
            borderWidth: 1,
        }],
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
    const lineData = {
        labels: countRestaurant.map(item => item.date),
        datasets: [
            {
                label: 'Monthly Revenue',
                data: countRestaurant.map(item => item.price),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 1)',
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
            },
        ],
    };


    if (user?.role !== 'ADMIN') {
        return (
            <div className="unauthorized text-center mt-5">
                <h2>권한이 없습니다</h2>
                <p>You do not have permission to view this content.</p>
            </div>
        );
    }


    return (
        <>
            <div className={styles.row}>
                <div className={styles.col}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>포스팅이 가장 많은 음식점 랭킹</div>
                        <div className={styles.cardBody}>
                            <div className={styles.chartContainer}>
                                <Bar
                                    data={restaurantData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            x: {title: {display: true, text: 'Restaurant'}},
                                            y: {title: {display: true, text: 'Count'}},
                                        },
                                        animation: false
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>좋아요를 많이 받은 포스팅의 음식점 랭킹</div>
                        <div className={styles.cardBody}>
                            <div className={styles.chartContainer}>
                                <Bar
                                    data={upvoteData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            x: {title: {display: true, text: 'Restaurant'}},
                                            y: {title: {display: true, text: 'Count'}},
                                        },
                                        animation: false
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>음식점 많은 지역 랭킹</div>
                        <div className={styles.cardBody}>
                            <div className={styles.chartContainer}>
                                <Doughnut data={areaData} options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: (context) => {
                                                    const label = context.label || '';
                                                    const value = context.raw || 0;
                                                    return `${label}: ${value}`;
                                                }
                                            }
                                        }
                                    }
                                }}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>월별 영수증 리뷰 사용 횟수</div>
                        <div className={styles.cardBody}>
                            <div className={styles.chartContainer}>
                                <Line data={lineData} options={{
                                    responsive: true,
                                    maintainAspectRatio: false,}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashBoard;
