import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import BookList from "./components/BookList";
import Cart from "./components/Cart";
import type { CartItem } from "./components/Cart";

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = sessionStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [showCart, setShowCart] = useState(false);

  const updateCart = (items: CartItem[]) => {
    setCartItems(items);
    sessionStorage.setItem("cart", JSON.stringify(items));
  };

  const addToCart = (book: { bookID: number; title: string; price: number }) => {
    const existing = cartItems.find((i) => i.bookID === book.bookID);
    let updated: CartItem[];
    if (existing) {
      updated = cartItems.map((i) =>
          i.bookID === book.bookID ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updated = [...cartItems, { ...book, quantity: 1 }];
    }
    updateCart(updated);
  };

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
      <div>
        {showCart ? (
            <Cart
                cartItems={cartItems}
                updateCart={updateCart}
                onContinueShopping={() => setShowCart(false)}
            />
        ) : (
            <BookList
                addToCart={addToCart}
                onViewCart={() => setShowCart(true)}
                totalItems={totalItems}
            />
        )}
      </div>
  );
}

export default App;