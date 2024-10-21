"use client";
import React, { useEffect, useState } from "react";
import styles from "src/css/mypage.module.css";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale, LineElement, PointElement } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import Link from "next/link";

ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, LineElement, PointElement, CategoryScale, LinearScale);

interface Revenue {
    restaurantName: string;
    total: number;
}

const data3 = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: 'Dataset 1',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        },
        {
            label: 'Dataset 2',
            data: [28, 48, 40, 19, 86, 27, 90],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        },
    ],
};

// Sample data for the line chart
const lineData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: 'Monthly Revenue',
            data: [50, 70, 100, 80, 90, 120, 150],
            fill: false,
            backgroundColor: 'rgba(75, 192, 192, 1)',
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
        },
    ],
};

export default function TotalRevenue() {
    const [revenue, setRevenue] = useState<Revenue | null>(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/receipt/total')
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch group details");
                }
                return response.json();
            })
            .then((data) => {
                setRevenue(data);
                console.log(data);
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
    }, []);

    return (
        <div className={styles.row}>
            <div className={styles.col}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>Bar Chart 1</div>
                    <div className={styles.cardBody}>
                        <div className={styles.chartContainer}>
                            <Bar data={data3} options={{ responsive: true, scales: { x: { stacked: true }, y: { stacked: true } } }} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.col}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>Line Chart</div>
                    <div className={styles.cardBody}>
                        <div className={styles.chartContainer}>
                            <Line data={lineData} options={{ responsive: true }} />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Link href="/receipt/insertReceipt">내 영수증 추가하기</Link>
            </div>
        </div>
    );
}
