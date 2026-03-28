export interface CartItem {
    bookID: number;
    title: string;
    price: number;
    quantity: number;
}

interface Props {
    cartItems: CartItem[];
    updateCart: (items: CartItem[]) => void;
    onContinueShopping: () => void;
}

export default function Cart({ cartItems, updateCart, onContinueShopping }: Props) {
    const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const updateQuantity = (bookID: number, quantity: number) => {
        if (quantity < 1) return;
        updateCart(cartItems.map((i) => i.bookID === bookID ? { ...i, quantity } : i));
    };

    const removeItem = (bookID: number) => {
        updateCart(cartItems.filter((i) => i.bookID !== bookID));
    };

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">🛒 Your Cart</h1>
                <button className="btn btn-outline-primary" onClick={onContinueShopping}>
                    ← Continue Shopping
                </button>
            </div>

            {cartItems.length === 0 ? (
                <div className="alert alert-info">
                    Your cart is empty. <button className="btn btn-link p-0" onClick={onContinueShopping}>Browse books</button>
                </div>
            ) : (
                <>
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                        <tr>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th>Remove</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.bookID}>
                                <td>{item.title}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>
                                    <div className="input-group input-group-sm" style={{ width: "120px" }}>
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => updateQuantity(item.bookID, item.quantity - 1)}
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            className="form-control text-center"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.bookID, parseInt(e.target.value) || 1)}
                                            min={1}
                                        />
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => updateQuantity(item.bookID, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td>${(item.price * item.quantity).toFixed(2)}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => removeItem(item.bookID)}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr className="table-success fw-bold">
                            <td colSpan={3} className="text-end">Total:</td>
                            <td colSpan={2}>${total.toFixed(2)}</td>
                        </tr>
                        </tfoot>
                    </table>
                </>
            )}
        </div>
    );
}