import { useEffect, useState } from "react";
import "../App.css";

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [publishedGalleries, setPublishedGalleries] = useState(0);
  const [eventGalleries, setEventGalleries] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [photos, setPhotos] = useState([]);
  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryPin, setGalleryPin] = useState("");
  const [gallery, setGallery] = useState(null);
  const [showGalleryDetails, setShowGalleryDetails] = useState(false);
  const [showEditGalleryModal, setShowEditGalleryModal] = useState(false);
  const [editGalleryPhotos, setEditGalleryPhotos] = useState([]);
  const [addedPhotoIds, setAddedPhotoIds] = useState([]);
  const [editGalleryLoading, setEditGalleryLoading] = useState(false);

  useEffect(() => {
    loadEvents();
    loadUsers();
  }, []);

  const loadEvents = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://photo-sharing-platform-backend.onrender.com/events",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to load events");
        return;
      }

      setEvents(data);

      let photoCount = 0;
      let publishedCount = 0;
      const galleryMap = {};

      for (const event of data) {
        try {
          const photoResponse = await fetch(
            `https://photo-sharing-platform-backend.onrender.com/photos/event/${event.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (photoResponse.ok) {
            const eventPhotos = await photoResponse.json();
            photoCount += eventPhotos.length;
          }
        } catch (error) {
          console.error(
            "Unable to load photos:",
            error
          );
        }

        try {
          const galleryResponse = await fetch(
            `https://photo-sharing-platform-backend.onrender.com/galleries/event/${event.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (galleryResponse.ok) {
            const eventGallery =
              await galleryResponse.json();

            galleryMap[event.id] = eventGallery;

            if (eventGallery.published) {
              publishedCount++;
            }
          }
        } catch (error) {
          console.log(
            `No gallery for event ${event.id}`
          );
        }
      }

      setTotalPhotos(photoCount);
      setPublishedGalleries(publishedCount);
      setEventGalleries(galleryMap);
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };

  const loadUsers = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://photo-sharing-platform-backend.onrender.com/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to load users");
        return;
      }

      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://photo-sharing-platform-backend.onrender.com/events",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: eventName,
            description: description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to create event"
        );
        return;
      }

      alert("Event created successfully!");

      setEventName("");
      setDescription("");
      setShowForm(false);

      loadEvents();
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };

  const openTeamModal = (event) => {
    setSelectedEvent(event);
    setSelectedUser("");
    setShowTeamModal(true);
  };

  const handleAssignTeamMember = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      alert("Please select a team member");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://photo-sharing-platform-backend.onrender.com/events/${selectedEvent.id}/team/${selectedUser}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to assign team member"
        );
        return;
      }

      alert(
        "Team member assigned successfully!"
      );

      setSelectedUser("");
      setShowTeamModal(false);

      loadEvents();
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };

  const loadPhotos = async (event) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://photo-sharing-platform-backend.onrender.com/photos/event/${event.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to load photos"
        );
        return;
      }

      setPhotos(data);
      setSelectedEvent(event);
      setShowPhotosModal(true);
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };

  const selectPhoto = async (photoId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://photo-sharing-platform-backend.onrender.com/photos/${photoId}/select`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to select photo"
        );
        return;
      }

      alert(
        "Photo selected successfully!"
      );

      if (selectedEvent) {
        loadPhotos(selectedEvent);
      }

      loadEvents();
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };

  const handleCreateGallery = async (e) => {
    e.preventDefault();

    if (!selectedEvent) {
      alert("Please select an event");
      return;
    }

    if (!/^\d{4}$/.test(galleryPin)) {
      alert("Please enter a 4-digit PIN");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const params = new URLSearchParams({
        eventId: selectedEvent.id,
        title: galleryTitle,
        pin: galleryPin,
      });

      const response = await fetch(
        `https://photo-sharing-platform-backend.onrender.com/galleries?${params.toString()}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const createdGallery =
        await response.json();

      if (!response.ok) {
        alert(
          createdGallery.message ||
            "Failed to create gallery"
        );
        return;
      }

      const photoResponse = await fetch(
        `https://photo-sharing-platform-backend.onrender.com/photos/event/${selectedEvent.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const eventPhotos =
        await photoResponse.json();

      if (!photoResponse.ok) {
        alert(
          eventPhotos.message ||
            "Gallery created but photos could not be loaded"
        );
        return;
      }

      const selectedPhotos =
        eventPhotos.filter(
          (photo) => photo.selected
        );

      let addedPhotos = 0;

      for (const photo of selectedPhotos) {
        const addPhotoResponse =
          await fetch(
            `https://photo-sharing-platform-backend.onrender.com/galleries/${createdGallery.id}/photos/${photo.id}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        if (addPhotoResponse.ok) {
          addedPhotos++;
        }
      }

      setGallery(createdGallery);

      setEventGalleries((previous) => ({
        ...previous,
        [selectedEvent.id]:
          createdGallery,
      }));

      setGalleryTitle("");
      setGalleryPin("");
      setShowGalleryModal(false);

      alert(
        `Gallery created successfully!\n${addedPhotos} selected photo(s) added.`
      );

      setShowGalleryDetails(true);

      loadEvents();
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };

  const openGalleryDetails = (event) => {
    const existingGallery =
      eventGalleries[event.id];

    if (!existingGallery) {
      alert("Gallery not found");
      return;
    }

    setSelectedEvent(event);
    setGallery(existingGallery);
    setShowGalleryDetails(true);
  };

  const publishGallery = async () => {
    if (!gallery) {
      alert("No gallery available");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://photo-sharing-platform-backend.onrender.com/galleries/${gallery.id}/publish`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to publish gallery"
        );
        return;
      }

      setGallery(data);

      if (selectedEvent) {
        setEventGalleries((previous) => ({
          ...previous,
          [selectedEvent.id]: data,
        }));
      }

      alert(
        "Gallery published successfully!"
      );

      loadEvents();
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };

  const getShareLink = () => {
    if (!gallery) return "";

    return `https://photo-sharing-platform-frontend.onrender.com/gallery/${gallery.shareToken}`;
  };

  const copyShareLink = async () => {
    const link = getShareLink();

    try {
      await navigator.clipboard.writeText(link);
      alert("Share link copied!");
    } catch (error) {
      console.error(error);
      alert("Unable to copy link");
    }
  };

  const openEditGallery = async (event) => {
    const existingGallery =
      eventGalleries[event.id];

    if (!existingGallery) {
      alert("Gallery not found");
      return;
    }

    const token = localStorage.getItem("token");

    setSelectedEvent(event);
    setGallery(existingGallery);
    setEditGalleryLoading(true);
    setShowEditGalleryModal(true);

    try {
      const photoResponse = await fetch(
        `https://photo-sharing-platform-backend.onrender.com/photos/event/${event.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const eventPhotos =
        await photoResponse.json();

      if (!photoResponse.ok) {
        alert(
          eventPhotos.message ||
            "Unable to load event photos"
        );
        return;
      }

      const galleryPhotoResponse =
        await fetch(
          `https://photo-sharing-platform-backend.onrender.com/galleries/${existingGallery.id}/photos`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const galleryPhotos =
        await galleryPhotoResponse.json();

      if (!galleryPhotoResponse.ok) {
        alert(
          galleryPhotos.message ||
            "Unable to load gallery photos"
        );
        return;
      }

      const alreadyAddedIds =
        galleryPhotos.map(
          (galleryPhoto) =>
            galleryPhoto.photo.id
        );

      setAddedPhotoIds(alreadyAddedIds);

      const selectedEventPhotos =
        eventPhotos.filter(
          (photo) => photo.selected
        );

      setEditGalleryPhotos(
        selectedEventPhotos
      );
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    } finally {
      setEditGalleryLoading(false);
    }
  };

  const addPhotoToExistingGallery = async (
    photoId
  ) => {
    if (!gallery) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://photo-sharing-platform-backend.onrender.com/galleries/${gallery.id}/photos/${photoId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to add photo"
        );
        return;
      }

      setAddedPhotoIds((previous) => [
        ...previous,
        photoId,
      ]);

      alert("Photo added to gallery!");
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

      <header className="dashboard-header">

        <div className="dashboard-logo">
          📷 Photo<span>Share</span>
        </div>

        <div className="admin-info">
          <span>Admin / Lead</span>

          <button onClick={logout}>
            Logout
          </button>
        </div>

      </header>

      <main className="dashboard-content">

        <div className="dashboard-title">

          <div>
            <h1>Admin Dashboard</h1>

            <p>
              Manage your photography events
              and galleries.
            </p>
          </div>

          <button
            className="create-event-btn"
            onClick={() => setShowForm(true)}
          >
            + Create Event
          </button>

        </div>

        <div className="dashboard-stats">

          <div className="stat-card">
            <h3>{events.length}</h3>
            <p>Total Events</p>
          </div>

          <div className="stat-card">
            <h3>{totalPhotos}</h3>
            <p>Total Photos</p>
          </div>

          <div className="stat-card">
            <h3>{publishedGalleries}</h3>
            <p>Published Galleries</p>
          </div>

        </div>

        <section className="events-section">

          <h2>Your Events</h2>

          {events.length === 0 ? (

            <div className="empty-events">

              <div>📸</div>

              <h3>No events yet</h3>

              <p>
                Create your first photography
                event to get started.
              </p>

            </div>

          ) : (

            <div className="events-grid">

              {events.map((event) => {

                const eventGallery =
                  eventGalleries[event.id];

                return (

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

                    <button
                      type="button"
                      className="manage-team-btn"
                      onClick={() =>
                        loadPhotos(event)
                      }
                    >
                      📸 View Photos
                    </button>

                    <button
                      type="button"
                      className="manage-team-btn"
                      onClick={() =>
                        openTeamModal(event)
                      }
                    >
                      👥 Manage Team
                    </button>

                    {!eventGallery && (

                      <button
                        type="button"
                        className="manage-team-btn"
                        onClick={() => {
                          setSelectedEvent(event);
                          setGalleryTitle("");
                          setGalleryPin("");
                          setShowGalleryModal(true);
                        }}
                      >
                        🖼️ Create Gallery
                      </button>

                    )}

                    {eventGallery && (

                      <>

                        <button
                          type="button"
                          className="manage-team-btn"
                          onClick={() =>
                            openEditGallery(event)
                          }
                        >
                          ✏️ Edit Gallery
                        </button>

                        {!eventGallery.published ? (

                          <button
                            type="button"
                            className="manage-team-btn"
                            onClick={() =>
                              openGalleryDetails(
                                event
                              )
                            }
                          >
                            🚀 Publish Gallery
                          </button>

                        ) : (

                          <button
                            type="button"
                            className="manage-team-btn"
                            onClick={() =>
                              openGalleryDetails(
                                event
                              )
                            }
                          >
                            🔗 View Gallery
                          </button>

                        )}

                      </>

                    )}

                  </div>

                );
              })}

            </div>

          )}

        </section>

      </main>

      {/* CREATE EVENT */}

      {showForm && (

        <div className="event-modal">

          <div className="event-form-card">

            <h2>Create New Event</h2>

            <p>
              Add a new photography event.
            </p>

            <form onSubmit={handleCreateEvent}>

              <input
                type="text"
                placeholder="Event name"
                value={eventName}
                onChange={(e) =>
                  setEventName(e.target.value)
                }
                required
              />

              <textarea
                placeholder="Event description"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                rows="4"
                required
              />

              <div className="event-form-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="create-btn"
                >
                  Create Event
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* MANAGE TEAM */}

      {showTeamModal && (

        <div className="event-modal">

          <div className="event-form-card">

            <h2>Manage Team</h2>

            <p>
              Assign a team member to{" "}
              <strong>
                {selectedEvent?.name}
              </strong>
            </p>

            <form
              onSubmit={
                handleAssignTeamMember
              }
            >

              <select
                value={selectedUser}
                onChange={(e) =>
                  setSelectedUser(
                    e.target.value
                  )
                }
                required
              >

                <option value="">
                  Select Team Member
                </option>

                {users
                  .filter(
                    (user) =>
                      user.role ===
                      "TEAM_MEMBER"
                  )
                  .map((user) => (

                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {user.name} —{" "}
                      {user.email}
                    </option>

                  ))}

              </select>

              <div className="event-form-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowTeamModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="create-btn"
                >
                  Assign Member
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* CREATE GALLERY */}

      {showGalleryModal && (

        <div className="event-modal">

          <div className="event-form-card">

            <h2>Create Gallery</h2>

            <p>
              Create a gallery for{" "}
              <strong>
                {selectedEvent?.name}
              </strong>
            </p>

            <form
              onSubmit={
                handleCreateGallery
              }
            >

              <input
                type="text"
                placeholder="Gallery title"
                value={galleryTitle}
                onChange={(e) =>
                  setGalleryTitle(
                    e.target.value
                  )
                }
                required
              />

              <input
                type="text"
                placeholder="4-digit PIN"
                value={galleryPin}
                onChange={(e) =>
                  setGalleryPin(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                maxLength="4"
                required
              />

              <div className="event-form-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowGalleryModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="create-btn"
                >
                  Create Gallery
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* GALLERY DETAILS */}

      {showGalleryDetails &&
        gallery && (

          <div className="event-modal">

            <div className="event-form-card">

              <h2>
                {gallery.published
                  ? "Gallery Published ✓"
                  : "Gallery Created"}
              </h2>

              <p>
                <strong>
                  {gallery.title}
                </strong>
              </p>

              <div className="gallery-details">

                <p>
                  <strong>
                    Status:
                  </strong>{" "}
                  {gallery.published
                    ? "Published"
                    : "Unpublished"}
                </p>

                <p>
                  <strong>
                    PIN:
                  </strong>{" "}
                  {gallery.pin}
                </p>

                {gallery.published && (

                  <p>

                    <strong>
                      Share Link:
                    </strong>

                    <br />

                    <span className="share-link">
                      {getShareLink()}
                    </span>

                  </p>

                )}

              </div>

              <div className="event-form-buttons">

                <button
                  type="button"
                  className="create-btn"
                  onClick={() => {
                    setShowGalleryDetails(
                      false
                    );

                    if (selectedEvent) {
                      openEditGallery(
                        selectedEvent
                      );
                    }
                  }}
                >
                  ✏️ Edit Gallery
                </button>

                {!gallery.published && (

                  <button
                    type="button"
                    className="create-btn"
                    onClick={publishGallery}
                  >
                    🚀 Publish Gallery
                  </button>

                )}

                {gallery.published && (

                  <button
                    type="button"
                    className="create-btn"
                    onClick={
                      copyShareLink
                    }
                  >
                    🔗 Copy Share Link
                  </button>

                )}

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowGalleryDetails(
                      false
                    )
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}

      {/* EDIT GALLERY */}

      {showEditGalleryModal &&
        gallery && (

          <div className="event-modal">

            <div className="event-form-card photos-modal">

              <h2>
                ✏️ Edit Gallery
              </h2>

              <p>
                Add selected photos to{" "}
                <strong>
                  {gallery.title}
                </strong>
              </p>

              {editGalleryLoading ? (

                <div className="empty-photos">

                  <div>⏳</div>

                  <h3>
                    Loading photos...
                  </h3>

                </div>

              ) : editGalleryPhotos.length ===
                0 ? (

                <div className="empty-photos">

                  <div>📷</div>

                  <h3>
                    No selected photos
                  </h3>

                  <p>
                    Select some photos first
                    from Event Photos.
                  </p>

                </div>

              ) : (

                <div className="photos-grid">

                  {editGalleryPhotos.map(
                    (photo) => {

                      const alreadyAdded =
                        addedPhotoIds.includes(
                          photo.id
                        );

                      return (

                        <div
                          className="photo-card"
                          key={photo.id}
                        >

                          <img
                            src={
                              photo.storageUrl
                            }
                            alt={
                              photo.fileName
                            }
                          />

                          <div className="photo-info">

                            <strong>
                              {photo.fileName}
                            </strong>

                            <span>
                              {alreadyAdded
                                ? "✓ Already in Gallery"
                                : "Selected by Admin"}
                            </span>

                          </div>

                          <button
                            type="button"
                            className="select-photo-btn"
                            disabled={
                              alreadyAdded
                            }
                            onClick={() =>
                              addPhotoToExistingGallery(
                                photo.id
                              )
                            }
                          >
                            {alreadyAdded
                              ? "✓ Added"
                              : "+ Add to Gallery"}
                          </button>

                        </div>

                      );
                    }
                  )}

                </div>

              )}

              <button
                type="button"
                className="cancel-btn close-photos-btn"
                onClick={() => {

                  setShowEditGalleryModal(
                    false
                  );

                  setEditGalleryPhotos(
                    []
                  );

                  setAddedPhotoIds([]);

                  loadEvents();
                }}
              >
                Done
              </button>

            </div>

          </div>

        )}

      {/* EVENT PHOTOS */}

      {showPhotosModal && (

        <div className="event-modal">

          <div className="event-form-card photos-modal">

            <h2>
              Event Photos
            </h2>

            <p>
              Photos uploaded to{" "}
              <strong>
                {selectedEvent?.name}
              </strong>
            </p>

            {photos.length === 0 ? (

              <div className="empty-photos">

                <div>📷</div>

                <h3>
                  No photos uploaded
                </h3>

                <p>
                  No team member has uploaded
                  photos to this event yet.
                </p>

              </div>

            ) : (

              <div className="photos-grid">

                {photos.map((photo) => (

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
                          ? "✓ Selected"
                          : "Pending Selection"}
                      </span>

                    </div>

                    <button
                      type="button"
                      className="select-photo-btn"
                      onClick={() =>
                        selectPhoto(photo.id)
                      }
                      disabled={
                        photo.selected
                      }
                    >
                      {photo.selected
                        ? "✓ Selected"
                        : "Select Photo"}
                    </button>

                  </div>

                ))}

              </div>

            )}

            <button
              type="button"
              className="cancel-btn close-photos-btn"
              onClick={() => {
                setShowPhotosModal(false);
                setPhotos([]);
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

export default AdminDashboard;