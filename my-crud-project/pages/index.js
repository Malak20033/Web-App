import { useState, useEffect } from 'react';

export default function HomePage() {
  // States for Customers, Orders, OrderDetails, and Products
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch data when the page loads
  useEffect(() => {
    async function fetchData() {
      const customersRes = await fetch('/api/customers');
      const customersData = await customersRes.json();
      setCustomers(customersData);

      const ordersRes = await fetch('/api/orders');
      const ordersData = await ordersRes.json();
      setOrders(ordersData);

      const orderDetailsRes = await fetch('/api/orderdetails');
      const orderDetailsData = await orderDetailsRes.json();
      setOrderDetails(orderDetailsData);

      const productsRes = await fetch('/api/products');
      const productsData = await productsRes.json();
      setProducts(productsData);
    }
    fetchData();
  }, []);

  // CRUD for Customers
  async function addCustomer(customer) {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    if (response.ok) {
      const newCustomer = await response.json();
      setCustomers([...customers, newCustomer]);
    }
  }

  async function deleteCustomer(customerId) {
    await fetch(`/api/customers?customerid=${customerId}`, { method: 'DELETE' });
    setCustomers(customers.filter(c => c.customerid !== customerId));
  }

  // CRUD for Orders
  async function addOrder(order) {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (response.ok) {
      const newOrder = await response.json();
      setOrders([...orders, newOrder]);
    }
  }

  async function deleteOrder(orderId) {
    await fetch(`/api/orders?orderid=${orderId}`, { method: 'DELETE' });
    setOrders(orders.filter(o => o.orderid !== orderId));
  }

  // CRUD for OrderDetails
  async function addOrderDetail(orderDetail) {
    const response = await fetch('/api/orderdetails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderDetail),
    });
    if (response.ok) {
      const newOrderDetail = await response.json();
      setOrderDetails([...orderDetails, newOrderDetail]);
    }
  }

  async function deleteOrderDetail(orderDetailId) {
    await fetch(`/api/orderdetails?orderdetailid=${orderDetailId}`, { method: 'DELETE' });
    setOrderDetails(orderDetails.filter(od => od.orderdetailid !== orderDetailId));
  }

  // CRUD for Products
  async function addProduct(product) {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (response.ok) {
      const newProduct = await response.json();
      setProducts([...products, newProduct]);
    }
  }

  async function deleteProduct(productId) {
    await fetch(`/api/products?productid=${productId}`, { method: 'DELETE' });
    setProducts(products.filter(p => p.productid !== productId));
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>

      {/* Customers Section */}
      <section>
        <h2>Customers</h2>
        <ul>
          {customers.map(customer => (
            <li key={customer.customerid}>
              {customer.firstname} {customer.lastname} ({customer.email})
              <button onClick={() => deleteCustomer(customer.customerid)}>Delete</button>
            </li>
          ))}
        </ul>
        <form
          onSubmit={e => {
            e.preventDefault();
            const form = e.target;
            const newCustomer = {
              firstname: form.firstname.value,
              lastname: form.lastname.value,
              email: form.email.value,
            };
            addCustomer(newCustomer);
            form.reset();
          }}
        >
          <input name="firstname" placeholder="First Name" required />
          <input name="lastname" placeholder="Last Name" required />
          <input name="email" placeholder="Email" required />
          <button type="submit">Add Customer</button>
        </form>
      </section>

      {/* Orders Section */}
      <section>
        <h2>Orders</h2>
        <ul>
          {orders.map(order => (
            <li key={order.orderid}>
              Order #{order.orderid} by Customer #{order.customerid} - {order.totalamount} USD
              <button onClick={() => deleteOrder(order.orderid)}>Delete</button>
            </li>
          ))}
        </ul>
        <form
          onSubmit={e => {
            e.preventDefault();
            const form = e.target;
            const newOrder = {
              customerid: form.customerid.value,
              totalamount: form.totalamount.value,
            };
            addOrder(newOrder);
            form.reset();
          }}
        >
          <input name="customerid" placeholder="Customer ID" required />
          <input name="totalamount" placeholder="Total Amount" required />
          <button type="submit">Add Order</button>
        </form>
      </section>

      {/* OrderDetails Section */}
      <section>
        <h2>Order Details</h2>
        <ul>
          {orderDetails.map(orderDetail => (
            <li key={orderDetail.orderdetailid}>
              Order #{orderDetail.orderid} - Product #{orderDetail.productid} - Quantity: {orderDetail.quantity}
              <button onClick={() => deleteOrderDetail(orderDetail.orderdetailid)}>Delete</button>
            </li>
          ))}
        </ul>
        <form
          onSubmit={e => {
            e.preventDefault();
            const form = e.target;
            const newOrderDetail = {
              orderid: form.orderid.value,
              productid: form.productid.value,
              quantity: form.quantity.value,
            };
            addOrderDetail(newOrderDetail);
            form.reset();
          }}
        >
          <input name="orderid" placeholder="Order ID" required />
          <input name="productid" placeholder="Product ID" required />
          <input name="quantity" placeholder="Quantity" required />
          <button type="submit">Add Order Detail</button>
        </form>
      </section>

      {/* Products Section */}
      <section>
        <h2>Products</h2>
        <ul>
          {products.map(product => (
            <li key={product.productid}>
              {product.name} - {product.price} USD
              <button onClick={() => deleteProduct(product.productid)}>Delete</button>
            </li>
          ))}
        </ul>
        <form
          onSubmit={e => {
            e.preventDefault();
            const form = e.target;
            const newProduct = {
              name: form.name.value,
              price: form.price.value,
            };
            addProduct(newProduct);
            form.reset();
          }}
        >
          <input name="name" placeholder="Product Name" required />
          <input name="price" placeholder="Price" required />
          <button type="submit">Add Product</button>
        </form>
      </section>
    </div>
  );
}
