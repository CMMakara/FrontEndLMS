import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import useUser from "../../hook/useUsers";
import { getAvatarUrl, handleAvatarError } from "../../utils/avatar";

function ProfileAdmin() {
  const { userProfile } = useUser();

  const profileImage = getAvatarUrl(userProfile?.profile_image, userProfile?.full_name || "Admin");

  return (
    <div className="container-fluid py-4" style={{ maxWidth: "1100px" }}>
      <style>{`
        .profile-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
        }
        .profile-banner {
          height: 110px;
          border-radius: 16px 16px 0 0;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
        }
        .profile-avatar-wrap {
          margin-top: -56px;
        }
        .profile-avatar {
          width: 112px;
          height: 112px;
          object-fit: cover;
          border-radius: 16px;
          border: 4px solid #ffffff;
          background: #fff;
        }
        .stat-box {
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          padding: 14px 16px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          font-size: 13px;
          color: #64748b;
        }
        .info-value {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
        }
        .detail-label {
          font-size: 12.5px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-bottom: 4px;
        }
        .detail-value {
          font-size: 14.5px;
          font-weight: 500;
          color: #0f172a;
          padding: 10px 12px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          min-height: 42px;
          display: flex;
          align-items: center;
        }
        .section-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .section-sub {
          font-size: 12.5px;
          color: #94a3b8;
          margin-bottom: 16px;
        }
        .locked-badge {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          background: #f1f5f9;
          border-radius: 8px;
          padding: 4px 10px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
      `}</style>

      <div className="mb-4">
        <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
          Admin Profile
        </h4>
        <p className="text-secondary mb-0" style={{ fontSize: "13.5px" }}>
          View your account details and preferences
        </p>
      </div>

      <div className="row g-4">
        {/* LEFT - Profile Card */}
        <div className="col-12 col-lg-4">
          <div className="profile-card h-100">
            <div className="profile-banner"></div>
            <div className="px-4 pb-4">
              <div className="profile-avatar-wrap">
                <img
                  src={profileImage}
                  alt="profile"
                  className="profile-avatar"
                  onError={(e) => handleAvatarError(e, userProfile?.full_name || "Admin")}
                />
              </div>

              <h5 className="fw-bold mt-3 mb-0" style={{ color: "#0f172a" }}>
                {userProfile?.full_name || "Admin User"}
              </h5>
              <span className="badge bg-danger" style={{ fontSize: "11px", borderRadius: "8px" }}>
                {userProfile?.role_name || "Admin"}
              </span>

              <div className="mt-4">
                <div className="info-row">
                  <span className="info-label">
                    <i className="bi bi-envelope me-2"></i>Email
                  </span>
                  <span className="info-value">{userProfile?.email || "-"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">
                    <i className="bi bi-telephone me-2"></i>Phone
                  </span>
                  <span className="info-value">{userProfile?.phone || "-"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">
                    <i className="bi bi-calendar3 me-2"></i>Joined
                  </span>
                  <span className="info-value">
                    {userProfile?.created_at
                      ? new Date(userProfile.created_at).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="row g-2 mt-3">
                <div className="col-6">
                  <div className="stat-box text-center">
                    <div className="fw-bold fs-5" style={{ color: "#0f172a" }}>
                      {userProfile?.books_managed ?? 0}
                    </div>
                    <div className="text-secondary" style={{ fontSize: "11.5px" }}>
                      Books Managed
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="stat-box text-center">
                    <div className="fw-bold fs-5" style={{ color: "#0f172a" }}>
                      {userProfile?.active_members ?? 0}
                    </div>
                    <div className="text-secondary" style={{ fontSize: "11.5px" }}>
                      Active Members
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT - Read-only Details */}
        <div className="col-12 col-lg-8">
          <div className="profile-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="section-title">Personal Information</div>
                <div className="section-sub">Your account details</div>
              </div>
              <span className="locked-badge">
                <i className="bi bi-lock-fill"></i> Read-only
              </span>
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="detail-label">Full Name</div>
                <div className="detail-value">{userProfile?.full_name || "-"}</div>
              </div>

              <div className="col-12 col-md-6">
                <div className="detail-label">Email Address</div>
                <div className="detail-value">{userProfile?.email || "-"}</div>
              </div>

              <div className="col-12 col-md-6">
                <div className="detail-label">Phone Number</div>
                <div className="detail-value">{userProfile?.phone || "-"}</div>
              </div>

              <div className="col-12 col-md-6">
                <div className="detail-label">Role</div>
                <div className="detail-value">{userProfile?.role_name || "Admin"}</div>
              </div>

              <div className="col-12">
                <div className="detail-label">Address</div>
                <div className="detail-value">{userProfile?.address || "-"}</div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="profile-card p-4">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="section-title">Security</div>
                <div className="section-sub">Password and account security</div>
              </div>
              <span className="locked-badge">
                <i className="bi bi-lock-fill"></i> Read-only
              </span>
            </div>

            <div className="detail-value mt-2">
              <i className="bi bi-shield-lock me-2 text-secondary"></i>
              Password changes are managed by the system administrator. Contact support if you need to reset your password.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileAdmin;