import { useEffect, useState } from "react";
import "../App.css";

function TeamDashboard() {
  const [events, setEvents] = useState([]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [myPhotos, setMyPhotos] = useState([]);
  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [myPhotoCount, setMyPhotoCount] = useState(0);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:9797/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to load events");
        return;
      }

      setEvents(data);

      // Calculate total photos uploaded by this team member
      let totalPhotos = 0;

      for (const event of data) {
        try {
          const photoResponse = await fetch(
            `http://localhost:9797/photos/my/event/${event.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (photoResponse.ok) {
            const photos = await photoResponse.json();
            totalPhotos += photos.length;
          }
        } catch (error) {
          console.error("Unable to load photo count:", error);
        }
      }

      setMyPhotoCount(totalPhotos);

    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };

  const openUploadModal = (event) => {
    setSelectedEvent(event);
    setSelectedFile(null);
    setShowUploadModal(true);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a photo");
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("eventId", selectedEvent.id);

    try {
      const response = await fetch(
        "http://localhost:9797/photos/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Photo upload failed");
        return;
      }

      alert("Photo uploaded successfully!");

      setSelectedFile(null);
      setSelectedEvent(null);
      setShowUploadModal(false);

      // Refresh events and photo count
      loadEvents();

    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };

  const loadMyPhotos = async (event) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:9797/photos/my/event/${event.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to load photos");
        return;
      }

      setMyPhotos(data);
      setSelectedEvent(event);
      setShowPhotosModal(true);

    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-page">

      {/* Header */}
      <header className="dashboard-header">

        <div className="dashboard-logo">
          📷 Photo<span>Share</span>
        </div>

        <div className="admin-info">
          <span>Team Member</span>

          <button onClick={logout}>
            Logout
          </button>
        </div>

      </header>


      {/* Main Content */}
      <main className="dashboard-content">

        {/* Dashboard Title */}
        <div className="dashboard-title">

          <div>
            <h1>Team Member Dashboard</h1>

            <p>
              View your assigned events and upload photos.
            </p>
          </div>

        </div>


        {/* Dashboard Stats */}
        <div className="dashboard-stats">

          <div className="stat-card">
            <h3>{events.length}</h3>
            <p>Assigned Events</p>
          </div>

          <div className="stat-card">
            <h3>{myPhotoCount}</h3>
            <p>My Photos</p>
          </div>

        </div>


        {/* Assigned Events */}
        <section className="events-section">

          <h2>My Assigned Events</h2>

          {events.length === 0 ? (

            <div className="empty-events">

              <div>📸</div>

              <h3>No assigned events</h3>

              <p>
                You have not been assigned to any event yet.
              </p>

            </div>

          ) : (

            <div className="events-grid">

              {events.map((event) => (

                <div
                  className="event-card"
                  key={event.id}
                >

                  <h3>{event.name}</h3>

                  <p>
                    {event.description ||
                      "No description available"}
                  </p>

                  <span>
                    Event ID: {event.id}
                  </span>


                  {/* Upload Photos */}
                  <button
                    type="button"
                    className="manage-team-btn"
                    onClick={() =>
                      openUploadModal(event)
                    }
                  >
                    📤 Upload Photos
                  </button>


                  {/* My Uploaded Photos */}
                  <button
                    type="button"
                    className="manage-team-btn"
                    onClick={() =>
                      loadMyPhotos(event)
                    }
                  >
                    🖼️ My Uploaded Photos
                  </button>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>


      {/* Upload Photo Modal */}
      {showUploadModal && (

        <div className="event-modal">

          <div className="event-form-card">

            <h2>Upload Photo</h2>

            <p>
              Upload a photo to{" "}
              <strong>
                {selectedEvent?.name}
              </strong>
            </p>

            <form onSubmit={handleUpload}>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setSelectedFile(
                    e.target.files[0]
                  )
                }
                required
              />


              {selectedFile && (

                <p className="selected-file">
                  Selected: {selectedFile.name}
                </p>

              )}


              <div className="event-form-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                  }}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="create-btn"
                >
                  Upload Photo
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* My Uploaded Photos Modal */}
      {showPhotosModal && (

        <div className="event-modal">

          <div className="event-form-card photos-modal">

            <h2>My Uploaded Photos</h2>

            <p>
              Photos uploaded to{" "}
              <strong>
                {selectedEvent?.name}
              </strong>
            </p>


            {myPhotos.length === 0 ? (

              <div className="empty-photos">

                <div>📷</div>

                <h3>No photos uploaded</h3>

                <p>
                  You haven't uploaded any photos
                  to this event yet.
                </p>

              </div>

            ) : (

              <div className="photos-grid">

                {myPhotos.map((photo) => (

                  <div
                    className="photo-card"
                    key={photo.id}
                  >

                    <img
                      src={photo.storageUrl}
                      alt={photo.fileName}
                    />

                    <div className="photo-info">

                      <strong>
                        {photo.fileName}
                      </strong>

                      <span>
                        {photo.selected
                          ? "✓ Selected by Admin"
                          : "Pending Review"}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            )}


            <button
              type="button"
              className="cancel-btn close-photos-btn"
              onClick={() => {
                setShowPhotosModal(false);
                setMyPhotos([]);
              }}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default TeamDashboard;