import { createSignal, onMount } from 'solid-js';
import '../../assets/style/inventory.css';
function Inventory() {

    const [equipment, setEquipment] = createSignal("");
    const [date, setDate] = createSignal("");
    const [quantity, setQuantity] = createSignal("");
    const [invData, setInvData] = createSignal([]);
    const [selectedItem, setSelectedItem] = createSignal(null);
    const [errorMessage, setErrorMessage] = createSignal("");

    const fetchInvData = async () => {
        try {
            const response = await fetch('http://localhost:4000/showinventory');
            if (response.ok) {
                const data = await response.json();
                setInvData(data); // Update the state with the fetched data
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('An error occurred while fetching data');
        }
    };

    const handleEdit = (inv_id, item) => {
        setSelectedItem({ ...item, inv_id: inv_id });
        setEquipment(item.inv_eq);
        setQuantity(item.inv_qty);
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:4000/updateinventory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inv_id: selectedItem().inv_id,
                    equipment: equipment(),
                    quantity: quantity()

                }),
            });

            if (response.ok) {
                setErrorMessage('Updated Successfully!');
                fetchInvData();
            } else {
                throw new Error('Failed to update inventory item');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (inv_id) => {
        const confirmed = window.confirm('Are you sure you want to DELETE this request?');
        if (!confirmed) return;

        try {
            const response = await fetch('http://localhost:4000/deleteinventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inv_id }),
            });

            if (response.ok) {
                window.alert('Deleted Successfully!');
                fetchInvData();
            } else {
                throw new Error('Failed to decline request');
            }
        } catch (error) {
            console.error(error);
        }
    };

    onMount(fetchInvData);
    const handleInv = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:4000/addinventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    equipment: equipment(),
                    date: date(),
                    quantity: quantity()
                }),
            });

            if (response.ok) {
                setErrorMessage('Added Successfully!');
                setEquipment("");
                setDate("");
                setQuantity("");

                const modal = document.getElementById('addInvForm');
                // modal.style.display = 'none';


            } else {
                setErrorMessage('An error occurred while adding data');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div class="d-sm-flex align-items-center justify-content-center mb-4">
                <h1 id="inventory-table" class="h3 mb-0 text-warning mx-auto">Inventory Table</h1>
            </div>

            <section class="p-2">

                <div class="row">
                    <div class="col-10">
                        <div class="float-right">
                            <button class="btn btn-primary add" data-bs-toggle="modal"
                                data-bs-target="#addInvForm">Add<i class="fa-solid fa-toolbox equipment"></i></button>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-10">
                        <table class="table table-hover mt-3 text-center table-info table-bordered mx-auto">

                            <thead>
                                <tr>
                                    <th class="bg-info text-white">Equipment</th>
                                    <th class="bg-info text-white">Date</th>
                                    <th class="bg-info text-white">Quantity</th>
                                    <th class="bg-info text-white">Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {invData().map((inv) => (
                                    <tr key={inv.inv_id} class='text-center'>
                                        <td>{inv.inv_eq}</td>
                                        <td>{inv.inv_date}</td>
                                        <td>{inv.inv_qty}</td>
                                        <td>
                                            <button onClick={() => handleEdit(inv.inv_id, inv)} data-bs-toggle="modal" data-bs-target="#editInvForm" class="btn btn-success">Edit</button>
                                            <button onClick={() => handleDelete(inv.inv_id)} class="btn btn-danger">Delete</button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>

                        </table>
                    </div>
                </div>

            </section>


            {/* Modal Form */}
            <div class="modal fade" id="addInvForm">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">

                        <div class="modal-header">
                            <h4 class="modal-title">Fill Up the Form</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>

                        <div class="modal-body">

                            <form onSubmit={handleInv} id="invForm">

                                <div class="form-group">
                                    <label for="equipment">Equipment:</label>
                                    <input type="text" id="equipment" value={equipment()} onInput={(e) => setEquipment(e.target.value)}
                                        placeholder="Enter equipment name" class="form-control" required autocomplete="off" />
                                </div>
                                <div class="form-group">
                                    <label for="date">Date:</label>
                                    <input type="date" value={date()} onInput={(e) => setDate(e.target.value)}
                                        id="date" class="form-control" required autocomplete="off" />
                                </div>
                                <div class="form-group">
                                    <label for="quantity">Quantity:</label>
                                    <input type="number" value={quantity()} onInput={(e) => setQuantity(e.target.value)}
                                        id="quantity" class="form-control" required autocomplete="off" />
                                </div>

                            </form>
                            {errorMessage() && <p class="text-danger">{errorMessage()}</p>}
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                            <button type="submit" form="invForm" class="btn btn-primary">Submit</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Form - Edit */}
            <div class="modal fade" id="editInvForm">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Edit Inventory Item</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdate();
                            }} id="editInvForm">
                                <div class="form-group">
                                    <label for="equipment">Equipment:</label>
                                    <input type="text" id="equipment" value={equipment()} onInput={(e) => setEquipment(e.target.value)} class="form-control" required autocomplete="off" />
                                </div>
                                <div class="form-group">
                                    <label for="quantity">Quantity:</label>
                                    <input type="number" id="quantity" value={quantity()} onInput={(e) => setQuantity(e.target.value)} class="form-control" required autocomplete="off" />
                                </div>

                                <div class="modal-footer">
                                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                                    <button type="submit" class="btn btn-primary">Save Changes</button>
                                </div>
                                {errorMessage() && <p class="text-danger">{errorMessage()}</p>}
                            </form>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
export default Inventory;