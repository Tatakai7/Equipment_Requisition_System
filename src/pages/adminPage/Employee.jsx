import { createSignal, onMount } from "solid-js";
import '../../assets/style/employee.css';

const App = () => {
    const [fullname, setFullname] = createSignal("");
    const [dept, setDept] = createSignal("");
    const [email, setEmail] = createSignal("");
    const [phonenum, setPhonenum] = createSignal("");
    const [username, setUsername] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [confirmPassword, setConfirmPassword] = createSignal("");
    const [usertype, setUserType] = createSignal("");
    const [employeeData, setEmployeeData] = createSignal([]);
    const [selectedItem, setSelectedItem] = createSignal(null);
    const [errorMessage, setErrorMessage] = createSignal("");

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:4000/showemployees');
            if (response.ok) {
                const data = await response.json();
                setEmployeeData(data); // Update the state with the fetched data
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('An error occurred while fetching data');
        }
    };

    onMount(fetchData);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (password() !== confirmPassword()) {
            setErrorMessage("Password do not match.");
            return;
        }

        try {
            const addEmpRes = await fetch('http://localhost:4000/addemployee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullname: fullname(),
                    dept: dept(),
                    email: email(),
                    phonenum: phonenum(),
                    username: username(),
                    password: password(),
                    usertype: usertype()
                }),
            });

            if (addEmpRes.ok) {
                setErrorMessage('Added Successfully!');
                setFullname("");
                setDept("");
                setEmail("");
                setPhonenum("");
                setUserType("");
                setUsername("");
                setPassword("");
                setConfirmPassword("");
                // Close modal
                const modal = document.getElementById("userForm");
                const bootstrapModal = new bootstrap.Modal(modal);
                bootstrapModal.hide();
                fetchData();

            } else {
                setErrorMessage("Add Employee Failed. Please try again.");
            }


        } catch (error) {
            setErrorMessage('An error occurred. Please try again later..');
        }
    };

    const handleEdit = (emp_id, item) => {
        setSelectedItem({ ...item, emp_id: emp_id });
        setFullname(item.emp_fn);
        setDept(item.emp_dept);
        setEmail(item.emp_email);
        setPhonenum(item.emp_phone);
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch('http://localhost:4000/updateemployee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emp_id: selectedItem().emp_id,
                    fullname: fullname(),
                    dept: dept(),
                    email: email(),
                    phonenum: phonenum(),
                }),
            });

            if (response.ok) {
                setErrorMessage('Updated Successfully!');
                fetchData();
            } else {
                throw new Error('Failed to update employee');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemove = async (emp_id) => {
        const confirmed = window.confirm('Are you sure you want to remove this employee?');
        if (!confirmed) return;
        try {
            const response = await fetch('http://localhost:4000/removeEmployee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emp_id }),
            });

            if (response.ok) {
                window.alert('Removed Successfully!');
                fetchData();
            } else {
                throw new Error('Failed to remove employee');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleResetConfirmation = (acc_id, username, emp_fn) => {
        console.log('reset: ', acc_id, username);
        const confirmed = window.confirm(`Are you sure you want to reset the password for user '${emp_fn}'? (username is new password)`);
        if (confirmed) {
            handleReset(acc_id, username);
        }
    };
    const handleReset = async (acc_id, username) => {
        try {
            const response = await fetch('http://localhost:4000/resetpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ acc_id, newPassword: username }),
            });

            if (response.ok) {
                window.alert('Password reset successfully!');
            } else {
                window.alert('Password reset failed!');

            }
        } catch (error) {
            console.error(error);
            setErrorMessage('An error occurred while resetting password');
        }
    }

    return (
        <>
            <div class="d-sm-flex align-items-center justify-content-center mb-4">
                <h1 id="employee-table" class="h3 mb-0 text-warning mx-auto">Employee Table</h1>
            </div>

            <section class="p-3">
                <div class="row">
                    <div class="col-12">
                        <div class="float-right">
                            <button class="btn btn-primary custom add" data-bs-toggle="modal"
                                data-bs-target="#userForm">Add<i class="fa-solid fa-user user"></i></button>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        {employeeData().length === 0 ? (
                            <p class="text-black text-center mt-5">No data available</p>
                        ) : (
                            <table class="table table-hover mt-3 text-center
                                    table-info table-bordered mx-auto">
                                <thead>
                                    <tr>
                                        <th class="bg-info text-white">Employee_Id</th>
                                        <th class="bg-info text-white">FullName</th>
                                        <th class="bg-info text-white ">Department</th>
                                        <th class="bg-info text-white">Email</th>
                                        <th class="bg-info text-white">Mobile_Num</th>
                                        <th class="bg-info text-white">Action</th>
                                    </tr>

                                </thead>
                                <tbody>
                                    {employeeData().map(employee => (
                                        <tr key={employee.emp_id} class="employeeDetails">
                                            <td>{employee.emp_id}</td>
                                            <td>{employee.emp_fn}</td>
                                            <td>{employee.emp_dept}</td>
                                            <td>{employee.emp_email}</td>
                                            <td>{employee.emp_phone}</td>
                                            <td>
                                                {/* Edit button */}
                                                <button class="btn btn-success" onClick={() => handleEdit(employee.emp_id, employee)} data-bs-toggle="modal" data-bs-target="#editForm">Edit</button>
                                                <button class="btn btn-warning" onClick={() => handleResetConfirmation(employee.acc_id, employee.username, employee.emp_fn)}>Reset</button>
                                                <button class="btn btn-danger" onClick={() => handleRemove(employee.emp_id)}>Remove</button>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </section>

            {/* Modal Form */}
            <div class="modal fade" id="userForm">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Fill Up the Form</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form onsubmit={handleFormSubmit} id="myForm">
                                <div class="inputField">
                                    <div>
                                        <label for="fullname" class="form-label">FullName:</label>
                                        <input type="text" class="form-control" value={fullname()} onInput={(e) => setFullname(e.target.value)} id="fullname" required autocomplete="off" />
                                    </div>
                                    <div>
                                        <label for="department" class="form-label">Department:</label>
                                        <input type="text" class="form-control" value={dept()} onInput={(e) => setDept(e.target.value)} id="department" required autocomplete="off" />
                                    </div>
                                    <div>
                                        <label for="email" class="form-label">E-mail:</label>
                                        <input type="email" class="form-control" value={email()} onInput={(e) => setEmail(e.target.value)} id="email" autocomplete="off" />
                                    </div>
                                    <div>
                                        <label for="phone" class="form-label">Mobile Num:</label>
                                        <input type="phone" class="form-control" value={phonenum()} onInput={(e) => setPhonenum(e.target.value)} id="phone" minlength="11" maxlength="11" autocomplete="off" />
                                    </div>
                                    <div>
                                        <label for="usertype" class="form-label">User Type:</label>
                                        <select id="usertype" class="form-select" value={usertype()} onChange={(e) => setUserType(e.target.value)} required>
                                            <option value="">Select User Type</option>
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label for="username" class="form-label">Username:</label>
                                        <input type="text" class="form-control" value={username()} onInput={(e) => setUsername(e.target.value)} id="username" required autocomplete="off" />
                                    </div>
                                    <div>
                                        <label for="password" class="form-label">Password:</label>
                                        <input type="password" class="form-control" value={password()} onInput={(e) => setPassword(e.target.value)} id="password" required autocomplete="off" />
                                    </div>
                                    <div>
                                        <label for="confirmpassword" class="form-label">Confirm Password:</label>
                                        <input type="password" class="form-control" value={confirmPassword()} onInput={(e) => setConfirmPassword(e.target.value)} id="conpassword" required autocomplete="off" />
                                    </div>
                                </div>
                            </form>
                            {errorMessage() && <p class="addEmpError mt-3">{errorMessage()}</p>}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                            <button type="submit" form="myForm" class="btn btn-primary">Submit</button>
                        </div>
                    </div>
                </div>
            </div>



            {/* Populate Data For Edit */}
            <div class="modal fade" id="editForm">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Edit Employee Item</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdate();
                            }} id="editForm">
                                <div class="form-group">
                                    <label for="fullname">Fullname:</label>
                                    <input type="text" id="fullname" value={fullname()} onInput={(e) => setFullname(e.target.value)} class="form-control" required autocomplete="off" />
                                </div>
                                <div class="form-group">
                                    <label for="department">Department:</label>
                                    <input type="text" id="department" value={dept()} onInput={(e) => setDept(e.target.value)} class="form-control" required autocomplete="off" />
                                </div>
                                <div class="form-group">
                                    <label for="email">Email:</label>
                                    <input type="email" id="email" value={email()} onInput={(e) => setEmail(e.target.value)} class="form-control" autocomplete="off" />
                                </div>
                                <div class="form-group">
                                    <label for="phone">Phone number:</label>
                                    <input type="number" id="phone" value={phonenum()} onInput={(e) => setPhonenum(e.target.value)} class="form-control" autocomplete="off" />
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
export default App;
