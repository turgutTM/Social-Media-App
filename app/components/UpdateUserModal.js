import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateUser } from "../features/UserSlice";
import { UploadButton } from "../utils/uploadthing";

const UpdateUserModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const darkMode = useSelector((state) => state.user.darkMode);

  const [formData, setFormData] = useState({
    email: user.email || "",
    profilePhoto: user.profilePhoto || "",
    password: user.password || "",
    name: user.name || "",
    surname: user.surname || "",
    live: user.live || "",
    school: user.school || "",
    worksAt: user.worksAt || "",
    wentTo: user.wentTo || "",
    link: user.link || "",
    coverPhoto: user.coverPhoto || "",
    bio: user.bio || "",
    birthday: user.birthday || "",
  });

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting form data:", formData);
      await axios.put(`/api/update-user/${user._id}`, formData);
      dispatch(updateUser(formData));
      closeModal();
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  const handleProfilePhotoUpload = (res) => {
    console.log("Profile photo uploaded: ", res);
    setFormData((prev) => ({ ...prev, profilePhoto: res[0].url }));
    alert("Profile Photo Upload Completed");
  };

  const handleCoverPhotoUpload = (res) => {
    console.log("Cover photo uploaded: ", res);
    setFormData((prev) => ({ ...prev, coverPhoto: res[0].url }));
    alert("Cover Photo Upload Completed");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`p-6 rounded-lg shadow-lg w-full max-w-lg h-auto max-h-[90vh] overflow-y-auto ${
          darkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-center mb-4 gap-4">
            <div className="text-center items-center flex flex-col gap-2">
              <img
                className="w-24 h-24 flex justify-center items-center rounded-full"
                src={
                  formData.profilePhoto ||
                  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                }
                alt="Profile"
              />
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={handleProfilePhotoUpload}
                onUploadError={(error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>

            <div className="text-center gap-2 flex flex-col">
              <img
                className="w-36 h-24 object-cover rounded-lg"
                src={
                  formData.coverPhoto ||
                  "https://via.placeholder.com/600x200?text=Cover+Photo"
                }
                alt="Cover"
              />
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={handleCoverPhotoUpload}
                onUploadError={(error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>
          </div>
          {/* User Information Fields */}
          <div className="flex flex-col gap-4 mb-4">
            {[
              { label: "Name", name: "name" },
              { label: "Surname", name: "surname" },
              { label: "Live", name: "live" },
              { label: "School", name: "school" },
              { label: "Works At", name: "worksAt" },
              { label: "Went To", name: "wentTo" },
              { label: "Link", name: "link" },
              { label: "Birthday", name: "birthday", type: "date" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {label}
                </label>
                <input
                  type={type || "text"}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`mt-1 p-2 border rounded-md w-full ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-100 border-gray-300"
                  }`}
                />
              </div>
            ))}
            <div>
              <label
                className={`block text-sm font-medium ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                maxLength="50"
                className={`mt-1 p-2 focus:outline-none border rounded-md w-full ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-100 border-gray-300"
                }`}
              />
              <p className="text-sm text-gray-500">
                {formData.bio.length}/50 characters
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={closeModal}
              className={`px-4 py-2 rounded-md ${
                darkMode
                  ? "bg-gray-600 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserModal;
