import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../App.css";

function CustomerGallery() {

  const { shareToken } = useParams();

  const [gallery, setGallery] = useState(null);
  const [pin, setPin] = useState("");
  const [photos, setPhotos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadGallery();
  }, [shareToken]);


  const loadGallery = async () => {

    try {

      const response = await fetch(
        `https://photo-sharing-platform-backend.onrender.com/galleries/public/${shareToken}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
          "Gallery not found"
        );
        return;
      }

      setGallery(data);

    } catch (error) {

      console.error(error);

      setError(
        "Unable to connect to server"
      );

    } finally {

      setLoading(false);
    }
  };


  const verifyPin = async (e) => {

    e.preventDefault();

    if (!/^\d{4}$/.test(pin)) {

      setError(
        "Please enter a 4-digit PIN"
      );

      return;
    }

    setError("");
    setVerifying(true);

    try {

      const params = new URLSearchParams({
        pin: pin,
      });

      const response = await fetch(
        `https://photo-sharing-platform-backend.onrender.com/galleries/public/${shareToken}/verify?${params.toString()}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setError(
          data.message ||
          "Invalid PIN"
        );

        setPhotos([]);
        setVerified(false);

        return;
      }

      setPhotos(data);
      setVerified(true);

    } catch (error) {

      console.error(error);

      setError(
        "Unable to connect to server"
      );

    } finally {

      setVerifying(false);
    }
  };


  if (loading) {

    return (
      <div className="gallery-page">

        <div className="gallery-loading">
          Loading gallery...
        </div>

      </div>
    );
  }


  if (error && !gallery) {

    return (
      <div className="gallery-page">

        <div className="gallery-error">

          <div className="gallery-error-icon">
            📷
          </div>

          <h1>
            Gallery Not Available
          </h1>

          <p>
            {error}
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="gallery-page">

      {/* Header */}

      <header className="gallery-header">

        <div className="gallery-logo">
          📷 Photo<span>Share</span>
        </div>

      </header>


      {/* Main */}

      <main className="gallery-content">

        {!verified ? (

          <div className="pin-card">

            <div className="pin-icon">
              🔐
            </div>

            <h1>
              {gallery?.title}
            </h1>

            <p>
              This gallery is protected.
            </p>

            <p>
              Enter the 4-digit PIN to
              view the photos.
            </p>


            <form onSubmit={verifyPin}>

              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter 4-digit PIN"
                value={pin}
                onChange={(e) => {
                  setPin(
                    e.target.value
                      .replace(/\D/g, "")
                  );
                  setError("");
                }}
                maxLength="4"
                autoFocus
              />


              {error && (

                <p className="pin-error">
                  {error}
                </p>

              )}


              <button
                type="submit"
                className="create-btn"
                disabled={verifying}
              >
                {verifying
                  ? "Verifying..."
                  : "View Gallery"}
              </button>

            </form>

          </div>

        ) : (

          <>

            {/* Gallery Title */}

            <div className="customer-gallery-title">

              <h1>
                {gallery?.title}
              </h1>

              <p>
                {photos.length} photo
                {photos.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>


            {/* Photos */}

            {photos.length === 0 ? (

              <div className="gallery-empty">

                <div>
                  📷
                </div>

                <h2>
                  No photos in this gallery
                </h2>

                <p>
                  The gallery does not contain
                  any photos yet.
                </p>

              </div>

            ) : (

              <div className="customer-photos-grid">

                {photos.map((photo) => (

                  <div
                    className="customer-photo-card"
                    key={photo.id}
                  >

                    <img
                      src={photo.storageUrl}
                      alt={photo.fileName}
                    />

                  </div>

                ))}

              </div>

            )}

          </>

        )}

      </main>

    </div>
  );
}

export default CustomerGallery;