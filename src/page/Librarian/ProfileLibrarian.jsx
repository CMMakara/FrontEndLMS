import React, { useRef, useState } from "react";
import useUser from '../../hook/useUsers'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
function ProfileLibrarian() {
    const { userProfile, updateProfile, getUserProfile, updateProfileImage, deleteProfileImage } = useUser();
    const [isModal, setIsModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);
    const [form, setForm] = useState({
        full_name: "",
        gender: "",
        phone: "",
        email: "",
        username: "",
        address: "",
    });

    const handleSelectImage = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPreviewImage(URL.createObjectURL(file));

        let res = await updateProfileImage(file)
        if (res) {
            setPreviewImage(null);
        }
    };

    const openModal = () => {
        setIsModal(true);
        setForm({
            full_name: userProfile?.full_name || "",
            gender: userProfile?.gender || "",
            phone: userProfile?.phone || "",
            email: userProfile?.email || "",
            username: userProfile?.username || "",
            address: userProfile?.address || "",
        });
    };
    const handleEditInformation = async () => {
        let res = await updateProfile(form);
        if (res) {
            await getUserProfile();
            setIsModal(false);
        }
    };


    return (
        <div className="d-flex bg-light container">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: "none" }}
            />
            {/* MAIN CONTENT AREA */}
            <div className="flex-grow-1 d-flex flex-column">

                {/* 3. DASHBOARD BODY */}
                <main className="p-4 flex-grow-1" style={{ maxWidth: '1200px', width: '100%' }}>

                    {/* Main Container Card */}
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">

                        {/* Header Banner Background */}
                        <div
                            style={{
                                background: 'linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%)',
                                height: '140px'
                            }}
                        />

                        {/* Profile Header Content */}
                        <div className="px-4 pb-4 position-relative" style={{ marginTop: '-40px' }}>
                            <div className="d-md-flex justify-content-between align-items-end">
                                <div className="d-flex align-items-end gap-3 flex-wrap">
                                    <img
                                        src={
                                            userProfile?.profile_image
                                                ? `${import.meta.env.VITE_API_URL}profiles/${userProfile?.profile_image}`
                                                : `${import.meta.env.VITE_API_URL}profiles/default-profile.png`
                                        }
                                        alt="Profile"
                                        className="rounded-circle border border-4 border-white shadow-sm"
                                        width="110"
                                        height="110"
                                        style={{ objectFit: "cover" }}
                                        onError={(e) => {
                                            e.target.src = `${import.meta.env.VITE_API_URL}profiles/default-profile.png`;
                                        }}
                                    />
                                    <div className="mb-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <h4 className="fw-bold mb-0 text-dark">{userProfile?.full_name}</h4>
                                            <span className="badge bg-success-subtle text-success rounded-pill px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                ● Verified Profile
                                            </span>
                                        </div>
                                        <p className="text-muted small mb-0 mt-1">
                                            <i className="bi bi-calendar3 me-1"></i> Start Date: 27 Jan 2025
                                        </p>
                                    </div>
                                </div>
                                <button className="btn btn-outline-secondary btn-sm rounded-3 px-3 fw-medium mb-2"
                                    onClick={handleSelectImage}>
                                    <i className="bi bi-pencil me-1"></i> Edit Profile
                                </button>
                            </div>
                        </div>

                        <hr className="mx-4 my-0 text-muted opacity-25" />

                        {/* Profile Details Grid Section */}
                        <div className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold text-dark mb-0">Profile details</h5>
                                <button className="btn btn-link text-secondary text-decoration-none btn-sm fw-medium p-0"
                                    onClick={() => openModal()}>
                                    <i className="bi bi-pencil me-1"></i> Edit
                                </button>
                            </div>

                            {/* Data Rows */}
                            <div className="row g-4">
                                {/* Column 1 */}
                                <div className="col-md-4">
                                    <div className="d-flex gap-3">
                                        <div className="text-muted"><i className="bi bi-person fs-5"></i></div>
                                        <div>
                                            <small className="text-muted d-block">Full Name</small>
                                            <span className="fw-semibold text-dark">{userProfile?.full_name}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-3 mt-4">
                                        <div className="text-muted"><i className="bi bi-person-badge fs-5"></i></div>
                                        <div>
                                            <small className="text-muted d-block">Username</small>
                                            <span className="fw-semibold text-dark">{userProfile?.username}</span>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-3 mt-4">
                                        <div className="text-muted"><i className="bi bi-geo-alt fs-5"></i></div>
                                        <div>
                                            <small className="text-muted d-block">Address</small>
                                            <span className="fw-semibold text-dark">{userProfile?.address || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 2 */}
                                <div className="col-md-4">
                                    <div className="d-flex gap-3">
                                        <div className="text-muted"><i className="bi bi-envelope fs-5"></i></div>
                                        <div>
                                            <small className="text-muted d-block">Email</small>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="fw-semibold text-dark">{userProfile?.email}</span>
                                                <span className="badge bg-success-subtle text-success rounded-pill px-2" style={{ fontSize: '0.65rem' }}>✓ Email Verified</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-3 mt-4">
                                        <div className="text-muted"><i className="bi bi-telephone fs-5"></i></div>
                                        <div>
                                            <small className="text-muted d-block">Number</small>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="fw-semibold text-dark">{userProfile?.phone || "N/A"}</span>
                                                <span className="badge bg-success-subtle text-success rounded-pill px-2" style={{ fontSize: '0.65rem' }}>✓ Number Verified</span>
                                            </div>
                                        </div>
                                    </div>


                                </div>


                            </div>
                        </div>

                        {/* 2-Factor Authentication Banner */}
                        <div className="mx-4 mb-4 p-3 rounded-4 d-flex align-items-center justify-content-between"
                            style={{ background: 'linear-gradient(90deg, #e8fbf4 0%, #f4fdfa 100%)', border: '1px solid #d1f2e5' }}>
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-white rounded-circle p-2 shadow-sm text-success d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                    <i className="bi bi-shield-lock-fill"></i>
                                </div>
                                <div>
                                    <h6 className="fw-bold text-dark mb-0">2-Factor Authentication</h6>
                                    <small className="text-muted">Add an extra layer of security to your account with two-Factor authentication.</small>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
            {/* Modal */}
            <Modal
                isOpen={isModal}
                onClose={() => setIsModal(false)}
                title='Edit Information'
                onSave={handleEditInformation}
                saveText="Save"
                children={
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <Input
                                    width="100%"
                                    label="Full Name"
                                    name="full_name"
                                    placeholder="Enter full name"
                                    icon="bi-person-fill"
                                    value={form.full_name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            full_name: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <Select
                                    width="100%"
                                    label="Gender"
                                    name="gender"
                                    icon="bi bi-gender-ambiguous"
                                    value={form.gender}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            gender: e.target.value,
                                        })
                                    }
                                    options={[
                                        { value: "", label: "Select Gender" },
                                        { value: "Male", label: "Male" },
                                        { value: "Female", label: "Female" },
                                        { value: "Other", label: "Other" },
                                    ]}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <Input
                                    width="100%"
                                    label="Phone Number"
                                    name="phone"
                                    placeholder="Enter phone number"
                                    icon="bi-telephone-fill"
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            phone: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <Input
                                    width="100%"
                                    label="Username"
                                    name="username"
                                    placeholder="Enter username"
                                    icon="bi-person-badge-fill"
                                    value={form.username}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            username: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="col-md-12 mb-3">
                                <Input
                                    width="100%"
                                    label="Address"
                                    name="address"
                                    placeholder="Enter address"
                                    icon="bi-geo-alt-fill"
                                    value={form.address}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            address: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="col-md-12 mb-3">
                                <Input
                                    width="100%"
                                    label="Email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter email"
                                    icon="bi-envelope-fill"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                }
            />
        </div>
    );
}

export default ProfileLibrarian;