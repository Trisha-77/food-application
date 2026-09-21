import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const StoreContext = createContext(null);

const getTokenExpiry = (authToken) => {
  try {
    const payload = authToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(payload));
    return Number(exp) * 1000;
  } catch { return 0; }
};

const isTokenValid = (authToken) => getTokenExpiry(authToken) > Date.now();

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [foodList, setFoodList] = useState([]);
  const [foodStatus, setFoodStatus] = useState('loading');
  const url = "http://localhost:4000";
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("token") || "";
    if (savedToken && !isTokenValid(savedToken)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return "";
    }
    return savedToken;
  });
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || null; } catch { return null; }
  });
  const [authReady, setAuthReady] = useState(false);

  //remove food_list state 

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      try {
        await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
      } catch (error) {
        console.error("Unable to update the cart.", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    if (!cartItems[itemId]) return;
    setCartItems((prev) => ({ ...prev, [itemId]: Math.max(0, (prev[itemId] || 0) - 1) }));
    if (token) {
      try {
        await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
      } catch (error) {
        console.error("Unable to update the cart.", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = foodList.find((product) => product._id === item);
        if (itemInfo) totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    setFoodStatus('loading');
    try {
      const response = await axios.get(url + "/api/food/list");
      if (!response.data.success) throw new Error(response.data.message || 'Unable to load menu.');
      setFoodList(response.data.data);
      setFoodStatus('success');
    } catch (error) {
      console.error("Unable to load the menu.", error);
      setFoodStatus('error');
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
      if (response.data.success) setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Unable to load the cart.", error);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken && isTokenValid(savedToken)) {
        await loadCartData(savedToken);
      }
      setAuthReady(true);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!token) return undefined;
    const remainingMs = getTokenExpiry(token) - Date.now();
    if (remainingMs <= 0) {
      logout();
      return undefined;
    }
    const expiryTimer = window.setTimeout(() => logout(), remainingMs);
    return () => window.clearTimeout(expiryTimer);
  }, [token]);

  const login = (authToken, authUser) => {
    if (!isTokenValid(authToken)) return;
    localStorage.setItem("token", authToken);
    if (authUser) localStorage.setItem("user", JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser || null);
    loadCartData(authToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    setCartItems({});
  };

  const contextValue = {
    food_list: foodList,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getCartItemCount: () => Object.values(cartItems).reduce((total, quantity) => total + (Number(quantity) || 0), 0),
    url,
    token,
    setToken,
    user,
    isAuthenticated: Boolean(token),
    authReady,
    foodStatus,
    fetchFoodList,
    login,
    logout,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
