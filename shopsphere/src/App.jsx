import { useState } from 'react'
import './App.css'

const products = [
  {
    id: 1,
    name: 'Fjallraven Backpack',
    category: 'Bags',
    description: 'Durable backpack suitable for everyday use.',
    price: 999,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'
  },
  {
    id: 2,
    name: 'Mens Casual T-Shirt',
    category: 'T-Shirts',
    description: 'Comfortable casual slim-fit t-shirt.',
    price: 1499,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'
  },
  {
    id: 3,
    name: 'Mens Casual Shirt',
    category: 'Shirts',
    description: 'Comfortable and stylish casual shirt.',
    price: 1999,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600'
  }
]

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('shopsphere-cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('shopsphere-wishlist')
    return savedWishlist ? JSON.parse(savedWishlist) : []
  })

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [error, setError] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortOption, setSortOption] = useState('default')

  function saveCart(updatedCart) {
    setCart(updatedCart)
    localStorage.setItem(
      'shopsphere-cart',
      JSON.stringify(updatedCart)
    )
  }

  function saveWishlist(updatedWishlist) {
    setWishlist(updatedWishlist)
    localStorage.setItem(
      'shopsphere-wishlist',
      JSON.stringify(updatedWishlist)
    )
  }

  function addToCart(product) {
    const existingProduct = cart.find(
      item => item.id === product.id
    )

    let updatedCart

    if (existingProduct) {
      updatedCart = cart.map(item =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    } else {
      updatedCart = [
        ...cart,
        {
          ...product,
          quantity: 1
        }
      ]
    }

    saveCart(updatedCart)
  }

  function increaseQuantity(productId) {
    const updatedCart = cart.map(item =>
      item.id === productId
        ? {
            ...item,
            quantity: item.quantity + 1
          }
        : item
    )

    saveCart(updatedCart)
  }

  function decreaseQuantity(productId) {
    const updatedCart = cart
      .map(item =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity - 1
            }
          : item
      )
      .filter(item => item.quantity > 0)

    saveCart(updatedCart)
  }

  function removeFromCart(productId) {
    const updatedCart = cart.filter(
      item => item.id !== productId
    )

    saveCart(updatedCart)
  }

  function toggleWishlist(product) {
    const exists = wishlist.some(
      item => item.id === product.id
    )

    let updatedWishlist

    if (exists) {
      updatedWishlist = wishlist.filter(
        item => item.id !== product.id
      )
    } else {
      updatedWishlist = [
        ...wishlist,
        product
      ]
    }

    saveWishlist(updatedWishlist)
  }

  function isInWishlist(productId) {
    return wishlist.some(
      item => item.id === productId
    )
  }

  function viewProductDetails(product) {
    setSelectedProduct(product)
  }

  function closeProductDetails() {
    setSelectedProduct(null)
  }

  function placeOrder() {
    if (
      customerName.trim() === '' ||
      customerEmail.trim() === '' ||
      customerAddress.trim() === ''
    ) {
      setError('Please fill in all customer details.')
      return
    }

    if (!customerEmail.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    setError('')
    setOrderPlaced(true)
  }

  const totalItems = cart.reduce(
    (total, product) =>
      total + product.quantity,
    0
  )

  const totalPrice = cart.reduce(
    (total, product) =>
      total + product.price * product.quantity,
    0
  )

  let filteredProducts = products.filter(product => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === 'All' ||
      product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  if (sortOption === 'low-high') {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.price - b.price
    )
  }

  if (sortOption === 'high-low') {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.price - a.price
    )
  }

  return (
    <div>
      <header className="navbar">
        <div className="logo">
          ShopSphere
        </div>

        <nav>
          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })
            }
          >
            Home
          </button>

          <button
            onClick={() =>
              document
                .getElementById('products')
                ?.scrollIntoView({
                  behavior: 'smooth'
                })
            }
          >
            Products
          </button>

          <button
            onClick={() =>
              document
                .getElementById('cart')
                ?.scrollIntoView({
                  behavior: 'smooth'
                })
            }
          >
            Cart ({totalItems})
          </button>

          <button
            onClick={() =>
              document
                .getElementById('wishlist')
                ?.scrollIntoView({
                  behavior: 'smooth'
                })
            }
          >
            Wishlist ({wishlist.length})
          </button>
        </nav>
      </header>

      <section className="hero">
        <h1>ShopSphere Products</h1>

        <p>
          Discover quality products at great prices.
        </p>
      </section>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={event =>
            setSearchTerm(event.target.value)
          }
        />
      </div>

      <div className="categories">
        <button
          className={
            selectedCategory === 'All'
              ? 'active-category'
              : ''
          }
          onClick={() =>
            setSelectedCategory('All')
          }
        >
          All
        </button>

        <button
          className={
            selectedCategory === 'Bags'
              ? 'active-category'
              : ''
          }
          onClick={() =>
            setSelectedCategory('Bags')
          }
        >
          Bags
        </button>

        <button
          className={
            selectedCategory === 'T-Shirts'
              ? 'active-category'
              : ''
          }
          onClick={() =>
            setSelectedCategory('T-Shirts')
          }
        >
          T-Shirts
        </button>

        <button
          className={
            selectedCategory === 'Shirts'
              ? 'active-category'
              : ''
          }
          onClick={() =>
            setSelectedCategory('Shirts')
          }
        >
          Shirts
        </button>
      </div>

      <div className="sort-container">
        <label htmlFor="sort">
          Sort by:
        </label>

        <select
          id="sort"
          value={sortOption}
          onChange={event =>
            setSortOption(event.target.value)
          }
        >
          <option value="default">
            Default
          </option>

          <option value="low-high">
            Price: Low to High
          </option>

          <option value="high-low">
            Price: High to Low
          </option>
        </select>
      </div>

      <div className="products" id="products">
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredProducts.map(product => (
            <div
              className="product"
              key={product.id}
            >
              <div className="product-category">
                {product.category}
              </div>

              <button
                className="wishlist-button"
                onClick={() =>
                  toggleWishlist(product)
                }
              >
                {isInWishlist(product.id)
                  ? '❤️'
                  : '🤍'}
              </button>

              <img
                src={product.image}
                alt={product.name}
              />

              <h2>
                {product.name}
              </h2>

              <p>
                {product.description}
              </p>

              <div className="rating">
                ⭐ {product.rating}
              </div>

              <p>
                ₹{product.price}
              </p>

              <button
                className="details-button"
                onClick={() =>
                  viewProductDetails(product)
                }
              >
                View Details
              </button>

              <button
                onClick={() =>
                  addToCart(product)
                }
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>

      {selectedProduct && (
        <div className="product-details-overlay">
          <div className="product-details">
            <button
              className="close-details"
              onClick={closeProductDetails}
            >
              ×
            </button>

            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
            />

            <div className="product-details-content">
              <div className="product-category">
                {selectedProduct.category}
              </div>

              <h2>
                {selectedProduct.name}
              </h2>

              <div className="rating">
                ⭐ {selectedProduct.rating}
              </div>

              <h3>
                ₹{selectedProduct.price}
              </h3>

              <p>
                {selectedProduct.description}
              </p>

              <button
                onClick={() => {
                  addToCart(selectedProduct)
                  closeProductDetails()
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="wishlist" id="wishlist">
        <h2>❤️ Wishlist</h2>

        {wishlist.length === 0 ? (
          <p>Your wishlist is empty</p>
        ) : (
          <div>
            {wishlist.map(product => (
              <div
                className="cart-item"
                key={product.id}
              >
                <span>
                  {product.name} - ₹{product.price}
                </span>

                <button
                  onClick={() =>
                    toggleWishlist(product)
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="cart" id="cart">
        <h2>Shopping Cart</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div>
            <p>Total items: {totalItems}</p>

            {cart.map(product => (
              <div
                className="cart-item"
                key={product.id}
              >
                <span>
                  {product.name} - ₹{product.price}
                </span>

                <div>
                  <button
                    onClick={() =>
                      decreaseQuantity(product.id)
                    }
                  >
                    -
                  </button>

                  <span>
                    {product.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQuantity(product.id)
                    }
                  >
                    +
                  </button>

                  <button
                    onClick={() =>
                      removeFromCart(product.id)
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <h3>
              Total Price: ₹{totalPrice}
            </h3>

            <button
              onClick={() =>
                setShowCheckout(true)
              }
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {showCheckout && !orderPlaced && (
        <div className="checkout">
          <h2>Checkout</h2>

          <p>
            Order Total: ₹{totalPrice}
          </p>

          <input
            type="text"
            placeholder="Enter your name"
            value={customerName}
            onChange={event =>
              setCustomerName(event.target.value)
            }
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={customerEmail}
            onChange={event =>
              setCustomerEmail(event.target.value)
            }
          />

          <textarea
            placeholder="Enter your address"
            value={customerAddress}
            onChange={event =>
              setCustomerAddress(event.target.value)
            }
          />

          {error && (
            <p>{error}</p>
          )}

          <button
            onClick={placeOrder}
          >
            Place Order
          </button>
        </div>
      )}

      {orderPlaced && (
        <div className="checkout">
          <h2>Order Confirmed!</h2>

          <p>
            Thank you, {customerName}.
          </p>

          <p>
            Email: {customerEmail}
          </p>

          <p>
            Total items: {totalItems}
          </p>

          <p>
            Total amount: ₹{totalPrice}
          </p>

          <p>
            Your order has been placed successfully.
          </p>
        </div>
      )}

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h2>ShopSphere</h2>
            <p>
              Your trusted destination for quality products
              at great prices.
            </p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <button
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                })
              }
            >
              Home
            </button>

            <button
              onClick={() =>
                document
                  .getElementById('products')
                  ?.scrollIntoView({
                    behavior: 'smooth'
                  })
              }
            >
              Products
            </button>

            <button
              onClick={() =>
                document
                  .getElementById('cart')
                  ?.scrollIntoView({
                    behavior: 'smooth'
                  })
              }
            >
              Cart
            </button>
          </div>

          <div className="footer-section">
            <h3>Customer Service</h3>
            <p>Help Center</p>
            <p>Returns</p>
            <p>Shipping Information</p>
          </div>

          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: support@shopsphere.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>India</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 ShopSphere. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App