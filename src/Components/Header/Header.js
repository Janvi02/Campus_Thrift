import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AllPostContext } from "../../contextStore/AllPostContext";
import { PostContext } from "../../contextStore/PostContext";
import { useAuth } from '../../contextStore/AuthContext';
import "./Header.css";
import SearchIcon from "../../assets/SearchIcon";
import Arrow from "../../assets/Arrow";
import SellButton from "../../assets/SellButton";
import SellButtonPlus from "../../assets/SellButtonPlus";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

import Search from "../Search/Search";
import AccountDropdown from '../AccountDropdown';

function Header() {
  const { user } = useAuth();
  const { allPost } = useContext(AllPostContext);
  const { setPostContent } = useContext(PostContext);
  const navigate = useNavigate();
  
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility

  // Function to handle search filtering
  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = allPost
      ? allPost.filter((value) =>
          value.name.toLowerCase().includes(searchWord.toLowerCase())
        )
      : [];

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  const handleSelectedSearch = (value) => {
    setPostContent(value);
    navigate("/view");
  };

  const handleEmptyClick = () => {
    alert("No items found.., please search by product name");
  };

  // Function to handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSellClick = () => {
    navigate('/create'); // Open the post ad form directly
  };

  return (
    <div className="headerParentDiv">
      <div className="headerChildDiv">
        {/* Search Input */}
        <div className="placeSearch">
          <input
            type="text"
            placeholder="Search specific product..."
            value={wordEntered}
            onChange={handleFilter}
            aria-label="Search specific product"
          />
          {filteredData.length === 0 ? (
            <div onClick={handleEmptyClick}>
              <SearchIcon />
            </div>
          ) : (
            <div id="clearBtn" onClick={clearInput}>
              <Arrow />
            </div>
          )}
          {filteredData.length !== 0 && (
            <div className="dataResult-header">
              {filteredData.slice(0, 15).map((value, key) => (
                <div
                  key={key}
                  className="dataItem-header"
                  onClick={() => handleSelectedSearch(value)}
                >
                  <p>{value.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Search */}
        <div className="productSearch">
          <Search />
        </div>

        {/* Language Selector */}
        <div className="language">
          <span>ENGLISH</span>
          <Arrow />
        </div>

        {/* User Account & Dropdown */}
        <div className="loginPage">
          {user ? (
            <div className="userMenu" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <span>Welcome, {user.displayName || "User"}</span>
              <Arrow />
              {dropdownOpen && (
                <div className="dropdownMenu">
                  <Link to="/dashboard">
                    <div className="dropdownItem">My Account</div>
                  </Link>
                  <div className="dropdownItem" onClick={handleLogout}>
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <span>Login</span>
            </Link>
          )}
          <hr />
        </div>

        {/* Sell Button */}
        <Link to="/create">
          <div className="sellMenu">
            <SellButton />
            <div className="sellMenuContent">
              <SellButtonPlus />
              <span>SELL</span>
            </div>
          </div>
        </Link>

        {/* Sell Menu with onClick */}
        <div className="sellMenu" onClick={handleSellClick}>
          <SellButton />
          <div className="sellMenuContent">
            <SellButtonPlus />
            <span>SELL</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
