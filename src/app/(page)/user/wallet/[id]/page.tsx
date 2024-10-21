"use client"
import React, {useEffect, useMemo, useState} from "react";
import {Line} from "react-chartjs-2";
import {Chart, registerables} from "chart.js";
import styles from "src/css/mypage.module.css";
import {CountCost} from "src/app/model/dash.model";
import {fetchReceiptCost} from "src/app/service/receipt/receipt.service";
import nookies from "nookies";

Chart.register(...registerables);


export default function MyWallet() {
    const [cost, setCost] = useState<CountCost[]>([]);

    const cookies = nookies.get();
    const id = cookies.userId;


    useEffect(() => {
        const fetchCostData = async () => {
            try {
                const resp = await fetchReceiptCost(id);
                setCost(resp);

            } catch (error) {
                console.error("Error fetching cost data", error);
            }
        };
        fetchCostData();
    }, [id]);


    const predefinedOrder = Array.from({length: 12}, (_, i) => `2024-${String(i + 1).padStart(2, '0')}`);

    // Memoize sorted cost data
    const sortedCost = useMemo(() => {
        return cost.sort((a, b) => predefinedOrder.indexOf(a.date) - predefinedOrder.indexOf(b.date));
    }, [cost]);

    const costData = useMemo(() => ({
        labels: sortedCost.map(item => item.date),
        datasets: [
            {
                label: 'Cost',
                data: sortedCost.map(item => item.price),
                fill: false,
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                tension: 0.1,
            }
        ],
    }), [sortedCost]);

    return (
        <div className={styles.col}>
            <div className={styles.cardHeader}>TOTAL COST</div>
            <div className={styles.cardBody}>
                <div className={styles.chartContainer}>
                    <Line
                        data={costData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                x: {title: {display: true, text: 'Month'}},
                                y: {title: {display: true, text: 'Cost'}},
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
