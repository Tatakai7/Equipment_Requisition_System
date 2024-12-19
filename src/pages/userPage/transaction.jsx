import '../../assets/style/userStyle/transaction.css';
import { createSignal, createEffect, onMount } from 'solid-js';
import userStore from '../../component/userStore';

export default function Transaction() {
    const userID = userStore().getUserID();

    const [tranData, setTranData] = createSignal([]);
    const fetchTranData = async () => {
        try {
            const response = await fetch('http://localhost:4000/showtransaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID: userID.emp_id }),
            });
            if (response.ok) {
                const data = await response.json();
                setTranData(data);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error(error);
        }
    };

    onMount(fetchTranData);

    return (
        <>
            <div class="d-sm-flex align-items-center justify-content-center mb-4">
                <h1 id="report-equipment" class="h3 mb-0 text-warning mx-auto">Equipment Requisitional Reports</h1>
            </div>

            <section class="p-2">
                <div class="row">
                    <div class="col-10">
                        {tranData().length === 0 ? (
                            <p class="text-black text-center">No transactions found.</p>
                        ) : (
                            <table class="table table-hover mt-3 text-center table-success table-bordered mx-auto">
                                <thead>
                                    <tr>
                                        <th class="bg-success text-white">Date</th>
                                        <th class="bg-success text-white">Equipment</th>
                                        <th class="bg-success text-white">Purpose</th>
                                        <th class="bg-success text-white">Status</th>
                                        <th class="bg-success text-white">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tranData().map((req) => (
                                        <tr key={req.req_id}>
                                            <td>{req.req_date}</td>
                                            <td>{req.req_eq}</td>
                                            <td>{req.req_purpose}</td>
                                            <td style={{ color: req.req_status === 'Pending' ? 'orange' : req.req_status === 'Approved' ? 'lightgreen' : req.req_status === 'Declined' ? 'red' : 'inherit' }}>
                                                {req.req_status}
                                            </td>

                                            <td>{req.req_qty}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </section>

        </>
    );
}
