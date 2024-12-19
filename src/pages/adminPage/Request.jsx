import '../../assets/style/request.css';
import { createSignal, onMount } from 'solid-js';


function Request() {
    const [reqData, setReqData] = createSignal([]);
    const fetchReqData = async () => {
        try {
            const response = await fetch('http://localhost:4000/showrequest');
            if (response.ok) {
                const data = await response.json();
                setReqData(data);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDecline = async (reqId) => {
        const confirmed = window.confirm('Are you sure you want to decline this request?');
        if (!confirmed) return;

        try {
            const response = await fetch('http://localhost:4000/declinerequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reqId }),
            });

            if (response.ok) {
                console.log('Request declined successfully');
                fetchReqData();
            } else {
                throw new Error('Failed to decline request');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleApprove = async (reqId, reqEq, reqQty) => {
        const confirmed = window.confirm('Are you sure you want to approve this request?');
        if (!confirmed) return;

        try {
            const response = await fetch('http://localhost:4000/approverequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reqId, reqEq, reqQty }),
            });

            const data = await response.json();

            if (response.ok) {
                window.alert(data.message);
                fetchReqData();
            } else {
                window.alert(data.error);
            }
        } catch (error) {
            window.alert('Failed to approve request');
        }
    };

    onMount(fetchReqData);

    return (
        <>
            <div class="d-sm-flex align-items-center justify-content-center mb-4">
                <h1 id="request-validate" class="h3 mb-0 text-warning mx-auto">Request Validation</h1>
            </div>

            <section class="p-2">
                <div class="row">
                    <div class="col-10 mx-auto">
                        {reqData().length === 0 ? (
                            <p class="text-black text-center mt-5">No data available</p>
                        ) : (
                            <table class="table table-hover mt-3 text-center table-center table-success table-bordered mx-auto">
                                <thead>
                                    <tr>
                                        <th class="bg-success text-white">Employee_Id</th>
                                        <th class="bg-success text-white">Equipment</th>
                                        <th class="bg-success text-white">Date</th>
                                        <th class="bg-success text-white">Purpose</th>
                                        <th class="bg-success text-white">Quantity</th>
                                        <th class="bg-success text-white">Status</th>
                                        <th class="bg-success text-white">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reqData().map((req) => (
                                        <tr key={req.req_id} class='text-white'>
                                            <td>{req.emp_id}</td>
                                            <td>{req.req_eq}</td>
                                            <td>{req.req_date}</td>
                                            <td>{req.req_purpose}</td>
                                            <td>{req.req_qty}</td>
                                            <td>{req.req_status}</td>
                                            <td>
                                                <button onClick={() => handleApprove(req.req_id, req.req_eq, req.req_qty)} class="btn btn-info">Approve</button>
                                                <button onClick={() => handleDecline(req.req_id)} class="btn btn-danger">Decline</button>
                                            </td>
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

export default Request;