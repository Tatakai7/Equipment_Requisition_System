import Chart from 'chart.js/auto';
import { createSignal, onCleanup, onMount } from 'solid-js';
import '../../assets/style/dashboard.css';

const BarChart = () => {
    let chartRef;
    let chartInstance;

    const [usersData, setUsersData] = createSignal({});
    const [adminsData, setAdminsData] = createSignal({});
    const [acceptedData, setAcceptedData] = createSignal({});
    const [declinedData, setDeclinedData] = createSignal({});

    const totalUsers = async () => {
        try {
            const response = await fetch('http://localhost:4000/totalUsers');
            const result = await response.json();

            setUsersData(result);
        } catch (error) {
            console.error(error);
        }
    };

    const totalAdmins = async () => {
        try {
            const response = await fetch('http://localhost:4000/totalAdmins');
            const result = await response.json();

            setAdminsData(result);
        } catch (error) {
            console.error(error);
        }
    };

    const totalAccepted = async () => {
        try {
            const response = await fetch('http://localhost:4000/totalAccepted');
            const result = await response.json();

            setAcceptedData(result);
        } catch (error) {
            console.error(error);
        }
    };

    const totalDeclined = async () => {
        try {
            const response = await fetch('http://localhost:4000/totalDeclined');
            const result = await response.json();

            setDeclinedData(result);
        } catch (error) {
            console.error(error);
        }
    };

    onMount(() => {
        totalUsers();
        totalAdmins();
        totalAccepted();
        totalDeclined();
        fetchData();
    });

    const fetchData = async () => {

    try{
        const response = await fetch('http://localhost:4000/dashboard');
        const result = await response.json();

        const labels = result.map(item => item.emp_dept);
        const dataValues = result.map(item => item.total_qty);


            const data = {
                labels: labels,
                datasets : [
                    {
                        label: 'Total Equipment Owned',
                        data: dataValues,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            };

            const options = {
                response: true,
                maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                },
            } ,
            };

        const ctx = chartRef.getContext('2d');
        if (chartInstance) {
            chartInstance.destroy();
        }
        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options,
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    };

    onCleanup(() => {
        if(chartInstance) {
            chartInstance.destroy();
        }
    });

    return (
        <>
        <div style={{ position: 'relative', width: 'fill-content', height: '400px' }}>
            <canvas ref={el => (chartRef = el)} />
        </div>
        <div class="dashboard-cards">
        <div class="card">
            <h3>Total Users</h3>
            {usersData() && (
            <p >{usersData().totalUsers}</p>
            )}
        </div>
        <div class="card">
            <h3>Total Admins</h3>
            {adminsData() && (
            <p>{adminsData().totalAdmins}</p>
            )}
        </div>
        <div class="card">
            <h3>Total Accepted Requests</h3>
            <p>{acceptedData().totalAccepted}</p>
        </div>
        <div class="card">
            <h3>Total Declined Requests</h3>
            <p>{declinedData().totalDeclined}</p>
        </div>
    </div>
    </>
    );
};

export default BarChart;
