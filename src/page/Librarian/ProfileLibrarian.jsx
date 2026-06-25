import React from "react";
import useUser from '../../hook/useUsers'
function ProfileLibrarian() {
    const {userProfile} = useUser()
    console.log(userProfile?.username)

    return (
        <div className="d-flex bg-light container">
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
                                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
                                        alt="Graziele Lopes"
                                        className="rounded-circle border border-4 border-white shadow-sm"
                                        width="110"
                                        height="110"
                                        style={{ objectFit: 'cover' }}
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
                                <button className="btn btn-outline-secondary btn-sm rounded-3 px-3 fw-medium mb-2">
                                    <i className="bi bi-pencil me-1"></i> Edit Profile
                                </button>
                            </div>
                        </div>

                        <hr className="mx-4 my-0 text-muted opacity-25" />

                        {/* Profile Details Grid Section */}
                        <div className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold text-dark mb-0">Profile details</h5>
                                <button className="btn btn-link text-secondary text-decoration-none btn-sm fw-medium p-0">
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
                                                <span className="fw-semibold text-dark">{userProfile?.number || "N/A"}</span>
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
        </div>
    );
}

export default ProfileLibrarian;