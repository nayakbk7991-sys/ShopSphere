import { useEffect, useState } from 'react'
import './App.css'

const products = [
  {
    id: 1,
    name: 'Fjallraven Backpack',
    price: 999,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'
  },
  {
    id: 2,
    name: 'Mens Casual T-Shirt',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'
  },
  {
    id: 3,
    name: 'Mens Casual Shirt',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600'
  }
]

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('shopsphere-cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  useEffect(() => {
    localStorage.setItem('shopsphere-cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      )

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...currentCart, { ...product, quantity: 1 }]
    })
  }

  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    )
  }

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">ShopSphere</div>

        <div className="cart-count">
          🛒 Cart ({totalItems})
        </div>
      </header>

      <main>
        <section className="products-section">
          <h1>Our Products</h1>
          <p className="subtitle">Add products to your shopping cart</p>

          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <img src={product.image} alt={product.name} />

                <div className="product-info">
                  <h2>{product.name}</h2>
                  <p className="price">₹{product.price}</p>

                  <button onClick={() => addToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="cart-section">
          <div className="cart-header">
            <h1>Shopping Cart</h1>
            <span>{totalItems} item(s)</span>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Add some products to get started.</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} />

                    <div className="cart-item-info">
                      <h2>{item.name}</h2>
                      <p>₹{item.price}</p>
                    </div>

                    <div className="quantity-controls">
                      <button onClick={() => decreaseQuantity(item.id)}>
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button onClick={() => increaseQuantity(item.id)}>
                        +
                      </button>
                    </div>

                    <div className="item-total">
                      ₹{item.price * item.quantity}
                    </div>

                    <button
                      className="remove-button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div>
                  <span>Total Items</span>
                  <strong>{totalItems}</strong>
                </div>

                <div>
                  <span>Total Price</span>
                  <strong>₹{totalPrice}</strong>
                </div>

                <button className="checkout-button">
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}

export default App