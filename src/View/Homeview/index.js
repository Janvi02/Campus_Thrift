import React, { useEffect, useState, useContext } from 'react';
import { useAuth } from '../../contextStore/AuthContext'; // Importing useAuth
import { AuthContext } from '../../contextStore/AuthContext'; // Importing AuthContext

import Header from '../../Components/Header/Header';
import Banner from '../../Components/Banner/Banner';
import Post from '../../Components/Post/Post';
import Footer from '../../Components/Footer/Footer';

function Home() {

  const { user } = useAuth(); // Destructure user from useAuth context
  const [currentUser, setCurrentUser] = useState(user); // Use local state for user

  useEffect(() => {
    // Simulate user authentication
    const fetchedUser = user; // Use the fetched user from AuthContext
    setCurrentUser(fetchedUser); // Update the local user state
  }, [user]); // Dependency array now tracks user context updates

  return (
    <div className="homeParentDiv">
      <Header />
      <Banner />
      <Post />
      <Footer />
    </div>
  );
}

export default Home;
