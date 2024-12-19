import { A } from '@solidjs/router';
import '../../index.css';
import { createSignal, onCleanup, onMount } from 'solid-js';
import userStore from '../../component/userStore';

const App = props => {
    const [showNotifications, setShowNotifications] = createSignal(false);
    const [showUserDropdown, setShowUserDropdown] = createSignal(false);
    const [notifData, setNotifData] = createSignal([]);
    const [userFirstName, setUserFirstName] = createSignal('');
    const [errorMessage, setErrorMessage] = createSignal('');
    const [showChangePasswordModal, setShowChangePasswordModal] = createSignal(false);
    const [oldPassword, setOldPassword] = createSignal('');
    const [newPassword, setNewPassword] = createSignal('');
    const [confirmPassword, setConfirmPassword] = createSignal('');

    const userID = userStore().getUserID();
    const accID = userStore().getAccID();

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications());
    };

    const toggleUserDropdown = () => {
        setShowUserDropdown(!showUserDropdown());
    }

    const closeDropdownsOnOutsideClick = (event) => {
        if (
            (showNotifications() || showUserDropdown()) &&
            !event.target.closest('.dropdown-list') &&
            !event.target.closest('.nav-link.dropdown-toggle')
        ) {
            setShowNotifications(false);
            setShowUserDropdown(false);
        }
    };
    const toggleChangePasswordModal = () => {
        setShowChangePasswordModal(!showChangePasswordModal());
    }

    const handleChangePassword = async (event) => {
        event.preventDefault();

        if (newPassword() !== confirmPassword()) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/changepassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accID: accID.acc_id,
                    oldPassword: oldPassword(),
                    newPassword: newPassword(),
                    confirmPassword: confirmPassword()
                }),
            });

            if (response.ok) {
                setErrorMessage('Password changed successfully');
            } else {
                throw new Error('Failed to change password');
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    onMount(async () => {
        try {
            const response = await fetch('http://localhost:4000/showusernotif', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID: userID.emp_id }),
            });
            if (response.ok) {
                const data = await response.json();
                setNotifData(data);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error(error);
        }
        document.addEventListener('click', closeDropdownsOnOutsideClick);
    })

    onMount(async () => {
        try {
            const response = await fetch('http://localhost:4000/getuserfn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID: userID.emp_id }),
            });
            if (response.ok) {
                const dataArray = await response.json();
                if (Array.isArray(dataArray) && dataArray.length > 0) {
                    const data = dataArray[0];
                    if (data && data.emp_fn) {
                        setUserFirstName(data.emp_fn);
                    } else {
                        console.error("Invalid data format or missing emp_fn property");
                    }
                } else {
                    console.error("Empty data array or invalid response format");
                }
            } else {
                throw new Error('Failed to fetch user information');
            }
        } catch (error) {
            console.error(error);
        }
    });

    const markNotificationRead = async (notificationId) => {
        try {
            const response = await fetch('http://localhost:4000/readnotif', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notificationId }),
            });

            if (response.ok) {
                console.log('Notification marked as read successfully');
            } else {
                console.error('Failed to mark notification as read:', response.statusText);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    onCleanup(() => {
        document.removeEventListener('click', closeDropdownsOnOutsideClick);
    });

    return (
        <div>
            <div id="wrapper">

                {/* <!-- Sidebar --> */}
                <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

                    {/* <!-- Sidebar - Brand --> */}
                    <div class="sidebar-brand d-flex align-items-center justify-content-center">
                        <div class="sidebar-brand-icon rotate-n-15">
                        </div>
                        <div class="sidebar-brand-text mx-3">
                            <A class="nav-link collapsed" href="/user" data-target="#collapseHome" aria-expanded="true"
                                aria-controls="collapseHome">
                                <i class="fa-solid fa-house"></i>
                                <span>Home</span>
                            </A>
                        </div>
                    </div>

                    {/* <!-- Divider --> */}
                    <hr class="sidebar-divider my-0" />

                    {/* <!-- Nav Item - Dashboard --> */}
                    <li class="nav-item active">
                        <A class="nav-link collapsed" href="/user/request" data-target="#collapserequest" aria-expanded="true" aria-controls="collapserequest">
                            <i class="fa-solid fa-code-pull-request"></i>
                            <span>Request</span>
                        </A>
                    </li>

                    {/* <!-- Divider --> */}
                    <hr class="sidebar-divider my-0" />

                    {/* <!-- Nav Item - Employee Collapse Menu --> */}
                    <li class="nav-item active">
                        <A class="nav-link collapsed" href="/user/transaction" data-target="#collapseTransaction" aria-expanded="true"
                            aria-controls="collapseTransaction">
                            <i class="fa-solid fa-right-left"></i>
                            <span>Transaction</span>
                        </A>
                    </li>

                    {/* <!-- Divider --> */}
                    <hr class="sidebar-divider my-0" />

                    {/* <!-- Nav Item - Report Collapse Menu --> */}
                    <li class="nav-item active">
                        <A class="nav-link collapsed" id="logout" href="/user/logout" data-target="#collapseLogout" aria-expanded="true"
                            aria-controls="collapseLogout">
                            <i class="fa-solid fa-right-from-bracket"></i>
                            <span>Logout</span>
                        </A>
                    </li>

                </ul>
                {/* <!-- End of Sidebar --> */}

                {/* <!-- Content Wrapper --> */}
                <div id="content-wrapper" class="d-flex flex-column">

                    {/* <!-- Topbar --> */}
                    <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                        <div class="logo-wrapper">
                            <img src="../../src/assets/img/soleco-logo.png" alt="logo" class="logo" />
                            <span class="caption">SOLECO, INC.</span>
                            <span class="subtitle">SOUTHERN LEYTE ELECTRIC COOPERATIVE, INC.</span>
                        </div>

                        {/* <!-- Topbar Navbar --> */}
                        <ul class="navbar-nav ml-auto">

                            {/* <!-- Nav Item - Alerts --> */}
                            <li class="nav-item dropdown no-arrow mx-1">
                                <a class="nav-link dropdown-toggle" id="notificationDropdown" role="button"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded={showNotifications()} onclick={toggleNotifications}>
                                    <i class="fa-solid fa-bell text-light"></i>
                                    {/* <!-- Counter - Alerts --> */}
                                    <span class="badge badge-danger badge-counter">{notifData().length > 0 ? notifData().length : null}</span>
                                </a>

                                {/* <!-- Dropdown - Alerts --> */}
                                <div class={`dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in ${showNotifications() ? 'show' : ''}`}
                                    aria-labelledby="notificationDropdown">
                                    <h6 class="dropdown-header">
                                        Notifications
                                    </h6>
                                    {notifData().length === 0 ? (
                                        <a class="dropdown-item">No notifications</a>
                                    ) : (
                                        notifData().map((notif) => (
                                            <a class="dropdown-item d-flex align-items-center" onClick={() => markNotificationRead(notif.req_id)}>
                                                <div class="mr-3">
                                                    <span>Your request has been {notif.req_status}.</span>
                                                </div>
                                            </a>
                                        ))
                                    )}
                                </div>
                            </li>
                            <div class="topbar-divider d-none d-sm-block"></div>

                            {/* <!-- Nav Item - User Information --> */}
                            <li class="nav-item dropdown no-arrow">
                                <a class="nav-link dropdown-toggle" id="userDropdown" role="button"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded={showUserDropdown()} onclick={toggleUserDropdown}>
                                    <span class="mr-2 d-none d-lg-inline text-white small font-weight-bold">{userFirstName()}</span>
                                    <img class="img-profile rounded-circle" src="../../src/assets/img/user.png" />
                                </a>
                                {/* <!-- Dropdown - User Information --> */}
                                <div class={`dropdown-menu dropdown-menu-right shadow animated--grow-in ${showUserDropdown() ? 'show' : ''}`}
                                    aria-labelledby="userDropdown">
                                    <a class="dropdown-item" onClick={toggleChangePasswordModal}>
                                        <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                        Change Password
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </nav>
                    {/* <!-- End of Topbar --> */}

                    {/* <!-- Main Content --> */}
                    <div id="container-fluid">
                        <div id="page-content" >
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>

            {showChangePasswordModal() && (
                <div class="modal change-password-modal" tabindex="-1" role="dialog" style="display: block;">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Change Password</h4>
                                <button type="button" class="close" onClick={toggleChangePasswordModal}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form onSubmit={handleChangePassword}>
                                    <div class="form-group">
                                        <label for="oldPassword">Old Password</label>
                                        <input type="password" class="form-control" id="oldPassword" value={oldPassword()} onInput={(e) => setOldPassword(e.target.value)} required />
                                    </div>
                                    <div class="form-group">
                                        <label for="newPassword">New Password</label>
                                        <input type="password" class="form-control" id="newPassword" value={newPassword()} onInput={(e) => setNewPassword(e.target.value)} required />
                                    </div>
                                    <div class="form-group">
                                        <label for="confirmPassword">Confirm Password</label>
                                        <input type="password" class="form-control" id="confirmPassword" value={confirmPassword()} onInput={(e) => setConfirmPassword(e.target.value)} required />
                                    </div>
                                    {errorMessage() && <p class="text-danger">{errorMessage()}</p>}
                                    <button type="submit" class="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;