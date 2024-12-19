import '../../assets/style/report.css';
import { createSignal, createEffect, onMount } from 'solid-js';

export default function Report() {
    const [repData, setRepData] = createSignal([]);
    const fetchRepData = async () => {
        try {
            const response = await fetch('http://localhost:4000/showreport');
            if (response.ok) {
                const data = await response.json();
                setRepData(data);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error(error);
        }
    };
    onMount(fetchRepData);

    return (
        <>
            <div class="d-sm-flex align-items-center justify-content-center mb-4">
                <h1 id="report-equipment" class="h3 mb-0 text-warning mx-auto">Equipment Requisitional Reports</h1>
            </div>

            <section class="p-2">
                <div class="row">
                    <div class="col-12">
                        <table class="table table-hover mt-3 text-center table-success table-bordered mx-auto">
                            <thead>
                                <tr>
                                    <th class="bg-success text-white">Issued Date</th>
                                    <th class="bg-success text-white">Equipment</th>
                                    <th class="bg-success text-white">Quantity</th>
                                    <th class="bg-success text-white">Employee ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {repData().map((rep) => (
                                    <tr key={rep.req_id} class=' text-white '>
                                        <td>{rep.req_date}</td>
                                        <td>{rep.req_eq}</td>
                                        <td>{rep.req_qty}</td>
                                        <td>{rep.emp_id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

        </>
    );
}
