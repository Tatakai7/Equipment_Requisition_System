import { createSignal, onMount } from 'solid-js';
import '../../assets/style/userStyle/urequest.css';
import userStore from '../../component/userStore';




function request() {
    const userID = userStore().getUserID();
    const [equipment, setEquipment] = createSignal("");
    const [date, setDate] = createSignal("");
    const [errorMessage, setErrorMessage] = createSignal("");
    const [purpose, setPurpose] = createSignal("");
    const [quantity, setQuantity] = createSignal("");
    const [reqData, setReqData] = createSignal([]);
    const [inventoryData, setInventoryData] = createSignal([]);

    const fetchReqData = async () => {
        try {
            const response = await fetch('http://localhost:4000/showuserrequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID: userID.emp_id }),
            });
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

    const fetchInventoryData = async () => {
        try {
            const response = await fetch('http://localhost:4000/showinventory');
            if (response.ok) {
                const data = await response.json();
                setInventoryData(data);
            } else {
                throw new Error('Failed to fetch inventory data');
            }
        } catch (error) {
            console.error(error);
        }
    };

    onMount(() => {
        fetchReqData();
        fetchInventoryData();
    });

    const handleRequest = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch('http://localhost:4000/addrequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    equipment: equipment(),
                    date: date(),
                    purpose: purpose(),
                    quantity: quantity(),
                    userID: userID.emp_id
                }),
            });

            if (response.ok) {
                setEquipment("");
                setDate("");
                setPurpose("");
                setQuantity("");

                setErrorMessage('Request added successfully!');
                fetchReqData();

            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <>
            <div class="d-sm-flex align-items-center justify-content-center mb-4">
                <h1 id="form" class="h3 mb-0 text-warning mx-auto">Requisition Form</h1>
            </div>

            <section class="p-2">
                <div class="row">
                    <div class="col-10">
                        <div class="float-right">
                            <button class="btn btn-primary add" data-bs-toggle="modal"
                                data-bs-target="#addReqInfo">Add<i class="fa-solid fa-code-pull-request req"></i></button>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-10 mx-auto">
                        {reqData().length === 0 ? (
                            <p class="text-black text-center mt-5">No data found.</p>
                        ) : (
                            <table class="table table-hover mt-3 text-center table-success table-bordered mx-auto">

                                <thead>
                                    <tr>
                                        <th class="bg-success text-white">Equipment</th>
                                        <th class="bg-success text-white">Date</th>
                                        <th class="bg-success text-white">Quantity</th>
                                        <th class="bg-success text-white">Purpose</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reqData().map((req) => (
                                        <tr key={req.req_id}>
                                            <td>{req.req_eq}</td>
                                            <td>{req.req_date}</td>
                                            <td>{req.req_qty}</td>
                                            <td>{req.req_purpose}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </section>

            {/* Modal Form */}
            <div class="modal fade" id="addReqInfo">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">

                        <div class="modal-header">
                            <h4 class="modal-title">Fill Up the Form</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div class="modal-body">
                            <form onsubmit={handleRequest} id="addReqInfoForm">
                                <div>
                                    <label for="equipment">Equipment:</label>
                                    <select id='equipment' value={equipment()} onInput={(e) => setEquipment(e.target.value)} required>
                                        <option value="">Select Equipment</option>
                                        {inventoryData().map((item) => (
                                            <option key={item.inv_id} value={item.inv_eq}>
                                                {item.inv_eq} (Available: {item.inv_qty})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label for="date">Date:</label>
                                    <input type="date" value={date()} onInput={(e) => setDate(e.target.value)} placeholder="Select date" id="date" required />
                                </div>

                                <div>
                                    <label for="equipment">Quantity:</label>
                                    <input type="number" value={quantity()} onInput={(e) => setQuantity(e.target.value)} placeholder="Ex: 1" id="quantity" required />
                                </div>

                                <div style="display: flex; flex-direction: column;">
                                    <div>
                                        <label for="purpose">Purpose:</label>
                                        <textarea placeholder="Write a purpose statement" id="purpose" value={purpose()} onInput={(e) => setPurpose(e.target.value)} style="resize: none;" rows="5" cols="45" ></textarea>
                                    </div>


                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" class="btn btn-primary" form='addReqInfoForm'>Submit</button>
                                    </div>
                                    {errorMessage() && <p class="text-danger">{errorMessage()}</p>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

export default request;