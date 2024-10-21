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
    fetchShowRestaurant, fetchTypeCount,
    fetchUpvoteRestaurant
} from "src/app/service/admin/admin.service";
import {Area, CountCost, CountItem, RestaurantList} from "src/app/model/dash.model";


ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale, PointElement, LineElement);
const DashBoard = () => {
    const [type, setType] = useState<CountItem[]>([]);
    const [region, setRegion] = useState<Area[]>([]);
    const [restaurant, setRestaurant] = useState<RestaurantList[]>([]);
    const [countRestaurant, setCountRestaurant] = useState<CountCost[]>([]);
    const [upvoteRestaurant, setUpvoteRestaurant] = useState<RestaurantList[]>([]);
    const userId = "6704a9cf53819846d322fc1d";


    useEffect(() => {
        const typeList = async () => {
            const data = await fetchTypeCount(userId);
            setType(data);
        };
        typeList();
    }, []);

    useEffect(() => {
        const showRestaurant = async () => {
            const data = await fetchShowRestaurant();
            setRestaurant(data);
        };
        showRestaurant();
    }, []);

    useEffect(() => {
        const countRestaurant = async () => {
            const data = await fetchReceiptList();
            setCountRestaurant(data);
        };
        countRestaurant();
    }, []);

    useEffect(() => {
        const restaurant = async () => {
            const data = await fetchUpvoteRestaurant();
            setUpvoteRestaurant(data);
        };
        restaurant();
    }, []);





    const typeData = {
        labels: type.map(item => item.nickname),
        datasets: [{
            data: type.map(item => item.count),
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
                        <div className={styles.cardHeader}>내가 선호하는 음식점 타입</div>
                        <div className={styles.cardBody}>
                            <div className={styles.chartContainer}>
                                <Doughnut data={typeData} options={{
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
        </>
    );
};

export default DashBoard;
