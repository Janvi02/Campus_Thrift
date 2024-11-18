import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { auth, db } from '../firebase'; // Import Firebase configuration

const Dashboard = () => {
  const [user, setUser] = useState({
    profilePicture: null,
    name: '',
    email: '',
    contact: '',
    institute: '',
    state: '',
    city: '',
    verified: false,
  });

  const [listings, setListings] = useState({
    active: [],
    sold: [],
    bought: [],
  });

  const [activeTab, setActiveTab] = useState('profile'); // State to track the active tab
  const [profilePic, setProfilePic] = useState(null); // State for the profile picture

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    // Function to fetch user data from Firestore
    const fetchUserData = async () => {
      const userId = auth.currentUser?.uid; // Get the current user's ID from Firebase auth
      if (userId) {
        try {
          const userDoc = await db.collection('users').doc(userId).get(); // Get user document
          if (userDoc.exists) {
            const userData = userDoc.data();
            setUser({
              profilePicture: userData.profilePicture || '',
              name: userData.name || '',
              email: userData.email || '',
              contact: userData.contact || '',
              institute: userData.institute || '',
              state: userData.state || '',
              city: userData.city || '',
              verified: userData.verified || false,
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    // Function to fetch user's listings data from Firestore
    const fetchUserListings = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        try {
          // Fetch active listings
          const activeSnapshot = await db
            .collection('listings')
            .where('userId', '==', userId)
            .where('status', '==', 'Available')
            .get();
          const activeListings = activeSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Fetch sold listings
          const soldSnapshot = await db
            .collection('listings')
            .where('userId', '==', userId)
            .where('status', '==', 'Sold')
            .get();
          const soldListings = soldSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Fetch bought listings
          const boughtSnapshot = await db
            .collection('purchases')
            .where('buyerId', '==', userId)
            .get();
          const boughtListings = boughtSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setListings({
            active: activeListings,
            sold: soldListings,
            bought: boughtListings,
          });
        } catch (error) {
          console.error('Error fetching listings:', error);
        }
      }
    };

    fetchUserData();
    fetchUserListings();
  }, []); // Empty dependency array to run on mount only

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result); // Set the profile picture in state
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="dashboard-container">
      {!user.verified && (
        <div className="status-warning">
          Your account is still in Pending State, <span>Verify Mobile</span> to activate.
        </div>
      )}

      {/* Tab navigation */}
      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabChange('profile')}
        >
          Profile
        </button>
        <button
          className={`tab ${activeTab === 'listings' ? 'active' : ''}`}
          onClick={() => handleTabChange('listings')}
        >
          My Listings
        </button>
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => handleTabChange('settings')}
        >
          Settings
        </button>
      </div>

      {/* Display user data based on active tab */}
      <div className="dashboard-content">
        {activeTab === 'profile' && (
          <div className="profile-info">
            <h2>Profile Information</h2>
            <div className="profile-picture-container">
              <div className="profile-picture">
                <img
                  src={profilePic || user.profilePicture || 'https://via.placeholder.com/150'}
                  alt="Profile"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ marginTop: '10px', display: 'block' }}
                id="profile-picture-upload"
              />
              <label htmlFor="profile-picture-upload" className="upload-button">
              </label>
            </div>
            <div className="profile-details">
              <input type="text" value={user.name} readOnly placeholder="Full Name" />
              <input type="email" value={user.email} readOnly placeholder="Email" />
              <input type="text" value={user.contact} readOnly placeholder="Contact Number" />
              <input type="text" value={user.institute} readOnly placeholder="Institute" />
              <input type="text" value={user.state} readOnly placeholder="State" />
              <input type="text" value={user.city} readOnly placeholder="City" />
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="user-listings">
            <h2>My Listings</h2>
            <div className="listings-container">
              <h3>Active Listings</h3>
              {listings.active.length > 0 ? (
                listings.active.map((listing) => (
                  <div key={listing.id} className="listing-item">
                    <h4>{listing.name}</h4>
                    <p>Price: {listing.price}</p>
                  </div>
                ))
              ) : (
                <p>No active listings</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

