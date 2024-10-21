"use client";
import React, {useEffect, useState} from "react";
import {Doughnut, Pie} from "react-chartjs-2";
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
import styles from "@/css/mypage.module.css";
import {fetchAreaCount, fetchShowArea, fetchTypeCount} from "@/app/service/admin/admin.service";
import {Area, CountItem} from "@/app/model/dash.model";
import nookies from "nookies";
import {usePathname} from "next/navigation";


ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale, PointElement, LineElement);
export default function UserDash() {
    const [type, setType] = useState<CountItem[]>([]);
    const [region, setRegion] = useState<Area[]>([]);
    const [area, setArea] = useState<Area[]>([]);

    const pathname = usePathname();
    const cookies = nookies.get();
    const userId = cookies.userId;

    const id = pathname?.split('/')[3];


    useEffect(() => {
        const dash = async () => {
            const data = await fetchTypeCount(userId);
            const regionData = await fetchShowArea();
            const areaData = await fetchAreaCount(userId);


            setType(data);
            setRegion(regionData);
            setArea(areaData)
        };
        dash();


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

    const areaData = {
        labels: region.map(item => item.area),
        datasets: [{
            data: region.map(item => item.total),
            backgroundColor: ["#fa8307", "#fd8a12", "#eca459", "#ecb780", "#F4CEA4FF"],
            borderColor: ["#fff", "#fff", "#fff", "#fff", "#fff"],
            borderWidth: 1,
        }],
    };

    const areaList = {
        labels: area.map(item => item.area),
        datasets: [{
            data: area.map(item => item.total),
            backgroundColor: ["#43aaad", "#4fc8cc", "#58dde1", "#5fedf1", "#64fbff"],
            borderColor: ["#fff", "#fff", "#fff", "#fff", "#fff"],
            borderWidth: 1,
        }],
    };


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
            <div className={styles.row}>
                <div className={styles.col}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>내가 자주 방문하는 지역</div>
                        <div className={styles.cardBody}>
                            <div className={styles.chartContainer}>
                                <Pie data={areaList} options={{
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
                        <div className={styles.cardHeader}>음식점 리뷰가 많은 지역 랭킹</div>
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

        </>
    )
}