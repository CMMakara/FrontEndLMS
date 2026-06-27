import React, { useState, useRef } from 'react'
import useUser from '../../hook/useUsers'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'

function ProfileLibrarianV2() {
  const fileInputRef = useRef(null)
  const [isModal, setIsModal] = useState(false);
  // Added local photo state for immediate preview upon selection
  const [photo, setPhoto] = useState(null); 
  const [form, setForm] = useState({
    full_name: "",
    gender: "",
    phone: "",
    email: "",
    username: "",
    address: "",
  });
  const { userProfile, updateProfile, getUserProfile, updateProfileImage , deleteProfileImage } = useUser()
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const imageSource = photo || (userProfile?.profile_image ? `${baseUrl}${userProfile.profile_image}` : 'https://via.placeholder.com/150');

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

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
    };
    reader.readAsDataURL(file);

    const res = await updateProfileImage(file);

    if (res) {
      await getUserProfile();
      setPhoto(null);
    }
  };

  const handleDeletePhoto = async() => {
    await deleteProfileImage()
    setPhoto(null)
    await getUserProfile()
  }

  return (
    <>
      <style>{`
        .profile-card  { border-radius: 20px; overflow: hidden; border: none; box-shadow: 0 8px 32px rgba(0,0,0,.10); }
        .profile-header{ background: linear-gradient(135deg,#1a3a5c 0%,#2e6da4 100%); padding: 40px 32px 60px; }
        .profile-header h5 { color:#a8c8f0; font-size:.8rem; letter-spacing:.15em; text-transform:uppercase; margin-bottom:2px; }
        .profile-header h2 { color:#fff; font-weight:700; font-size:1.5rem; margin:0; }
        .avatar-wrap   { position:relative; display:inline-block; margin-top:-50px; }
        .avatar-wrap img{ width:100px; height:100px; border-radius:50%; border:4px solid #fff; object-fit:cover; box-shadow:0 4px 16px rgba(0,0,0,.18); }
        .avatar-btns   { position:absolute; bottom:0; right:-8px; display:flex; flex-direction:column; gap:5px; }
        .av-btn        { width:28px; height:28px; border-radius:50%; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:.75rem; box-shadow:0 2px 6px rgba(0,0,0,.15); transition:transform .15s; }
        .av-btn:hover  { transform:scale(1.12); }
        .av-change     { background:#2e6da4; color:#fff; }
        .av-delete     { background:#dc3545; color:#fff; }
        .badge-role    { background:#e8f0fe; color:#1a3a5c; border-radius:20px; font-size:.78rem; font-weight:600; padding:4px 14px; }
        .info-label    { font-size:.72rem; color:#6c757d; text-transform:uppercase; letter-spacing:.08em; margin-bottom:2px; font-weight:600; }
        .info-value    { font-size:.95rem; color:#1a2b3c; margin:0; font-weight:500; }
        .stat-pill     { background:#f0f4f8; border-radius:12px; padding:12px 18px; text-align:center; }
        .stat-pill .num{ font-size:1.3rem; font-weight:700; color:#1a3a5c; }
        .stat-pill .lbl{ font-size:.72rem; color:#6c757d; text-transform:uppercase; letter-spacing:.07em; }
        .btn-edit-main { background:#1a3a5c; color:#fff; border-radius:10px; font-weight:600; padding:9px 28px; border:none; transition:background .2s; }
        .btn-edit-main:hover { background:#2e6da4; color:#fff; }
        .modal-backdrop-custom { position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:1040; display:flex; align-items:center; justify-content:center; }
        .modal-box     { background:#fff; border-radius:18px; width:100%; max-width:420px; padding:28px; box-shadow:0 8px 40px rgba(0,0,0,.18); animation:slideUp .22s ease; }
        @keyframes slideUp { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
        .modal-box .form-control { border-radius:8px; border:1.5px solid #dde3ea; font-size:.95rem; }
        .modal-box .form-control:focus { border-color:#2e6da4; box-shadow:0 0 0 3px rgba(46,109,164,.12); }
      `}</style>

      <div className="container">
        <div className="card profile-card">
          {/* Header */}
          <div className="profile-header">
            <h5>Librarian Profile</h5>
            <h2>Library Management System</h2>
          </div>

          {/* Body */}
          <div className="px-4 pb-4">
            {/* Avatar row */}
            <div className="d-flex align-items-end justify-content-between mb-2">
              <div className="avatar-wrap">
                {/* Bound the dynamic image source here */}
                <img src={imageSource} alt="Profile" />
                <div className="avatar-btns">
                  <button
                    className="av-btn av-change"
                    title="Change photo"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <i className="bi bi-camera-fill" />
                  </button>
                  <button
                    className="av-btn av-delete"
                    title="Delete photo"
                    onClick={handleDeletePhoto}
                  >
                    <i className="bi bi-trash3-fill" />
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handlePhotoChange}
                />
              </div>
              <div className="text-end pb-1">
                <span className="badge-role">
                  <i className="bi bi-book me-1" />{userProfile?.role_name}
                </span>
              </div>
            </div>

            {/* Name / Email */}
            <div className="mb-3">
              <div className="fw-bold fs-5 text-dark">{userProfile?.full_name}</div>
              <div className="text-muted" style={{ fontSize: '.88rem' }}>{userProfile?.email}</div>
            </div>

            <hr />

            {/* Info fields */}
            <div className="row gy-3 mb-4">
              {[
                ['full name', userProfile?.full_name],
                ['username', userProfile?.username],
                ['gender', userProfile?.gender || "N/A"],
                ['email', userProfile?.email],
                ['Phone', userProfile?.phone],
                ['address', userProfile?.address],
                [
                  'Created At',
                  userProfile?.created_at
                    ? new Date(userProfile.created_at).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'N/A',
                ],
              ].map(([label, value]) => (
                <div className="col-6" key={label}>
                  <div className="info-label">{label}</div>
                  <p className="info-value">{value}</p>
                </div>
              ))}
            </div>

            <div className='text-end'>
              <button className="btn btn-edit-main" onClick={openModal}>
                <i className="bi bi-pencil-square me-2" />Edit Information
              </button>
            </div>
          </div>
        </div>
        {/* Modal */}
        <Modal
          isOpen={isModal}
          onClose={() => setIsModal(false)}
          title='Edit Information'
          onSave={handleEditInformation}
          saveText="Save"
        >
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
        </Modal>
      </div>
    </>
  )
}

export default ProfileLibrarianV2