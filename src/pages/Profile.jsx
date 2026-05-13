import React from "react";

const Profile = ({ setIsProfilVisible, user }) => {
  return (
    <section className="profile-modal">
      <div
        className="overlay"
        onClick={() => setIsProfilVisible(false)}
      >
        <div
          className="modal"
          onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
        >
          <div className="modal-header">
            <h3>Profile</h3>
            <button
              className="close-btn"
              onClick={() => setIsProfilVisible(false)}
            >
              ✕
            </button>
          </div>

          <div className="modal-body">
            <div className="profile-field">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>

            <div className="profile-field">
              <label>User ID</label>
              <p>{user?.uid}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;