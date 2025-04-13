import React, { useState, useEffect } from 'react';

export default function HomePage() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [products, setProducts] = useState([]);

  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [editCustomerData, setEditCustomerData] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editOrderData, setEditOrderData] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editProductData, setEditProductData] = useState(null);
  const [showOrderDetailForm, setShowOrderDetailForm] = useState(false);
  const [editOrderDetailData, setEditOrderDetailData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [customersRes, ordersRes, orderDetailsRes, productsRes] = await Promise.all([
          fetch('/api/customers'),
          fetch('/api/orders'),
          fetch('/api/orderdetails'),
          fetch('/api/products'),
        ]);

        const customersData = await customersRes.json();
        const ordersData = await ordersRes.json();
        const orderDetailsData = await orderDetailsRes.json();
        const productsData = await productsRes.json();

        if (Array.isArray(customersData)) setCustomers(customersData);
        if (Array.isArray(ordersData)) setOrders(ordersData);
        if (Array.isArray(orderDetailsData)) setOrderDetails(orderDetailsData);
        if (Array.isArray(productsData)) setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  function hideForm(setShowForm, setEditData) {
    setShowForm(false);
    setEditData(null);
  }

  function createOrUpdateCustomer(event) {
    event.preventDefault();
    const form = event.target;
    const updatedCustomer = {
      customerid: editCustomerData ? editCustomerData.customerid : customers.length + 1,
      firstname: form.firstname.value,
      lastname: form.lastname.value,
      email: form.email.value,
    };

    if (editCustomerData) {
      setCustomers(customers.map((customer) =>
        customer.customerid === editCustomerData.customerid ? updatedCustomer : customer
      ));
    } else {
      setCustomers([...customers, updatedCustomer]);
    }
    hideForm(setShowCustomerForm, setEditCustomerData);
  }

  function createOrUpdateOrder(event) {
    event.preventDefault();
    const form = event.target;
    const updatedOrder = {
      orderid: editOrderData ? editOrderData.orderid : orders.length + 1,
      customerid: form.customerid.value,
      orderdate: form.orderdate.value,
      status: form.status.value,
    };

    if (editOrderData) {
      setOrders(orders.map((order) =>
        order.orderid === editOrderData.orderid ? updatedOrder : order
      ));
    } else {
      setOrders([...orders, updatedOrder]);
    }
    hideForm(setShowOrderForm, setEditOrderData);
  }

  function createOrUpdateProduct(event) {
    event.preventDefault();
    const form = event.target;
    const updatedProduct = {
      productid: editProductData ? editProductData.productid : products.length + 1,
      productname: form.productname.value,
      price: form.price.value,
      category: form.category.value,
    };

    if (editProductData) {
      setProducts(products.map((product) =>
        product.productid === editProductData.productid ? updatedProduct : product
      ));
    } else {
      setProducts([...products, updatedProduct]);
    }
    hideForm(setShowProductForm, setEditProductData);
  }

  function createOrUpdateOrderDetail(event) {
    event.preventDefault();
    const form = event.target;
    const updatedOrderDetail = {
      orderdetailid: editOrderDetailData ? editOrderDetailData.orderdetailid : orderDetails.length + 1,
      orderid: form.orderid.value,
      productid: form.productid.value,
      quantity: form.quantity.value,
    };

    if (editOrderDetailData) {
      setOrderDetails(orderDetails.map((detail) =>
        detail.orderdetailid === editOrderDetailData.orderdetailid ? updatedOrderDetail : detail
      ));
    } else {
      setOrderDetails([...orderDetails, updatedOrderDetail]);
    }
    hideForm(setShowOrderDetailForm, setEditOrderDetailData);
  }

  const deleteCustomer = (id) => setCustomers(customers.filter((c) => c.customerid !== id));
  const deleteOrder = (id) => setOrders(orders.filter((o) => o.orderid !== id));
  const deleteProduct = (id) => setProducts(products.filter((p) => p.productid !== id));
  const deleteOrderDetail = (id) => setOrderDetails(orderDetails.filter((d) => d.orderdetailid !== id));

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>

      {/* Customers Section */}
      <section>
        <h2>Customers</h2>
        <button onClick={() => setShowCustomerForm(true)}>Add New Customer</button>
        <table border="1">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.customerid}>
                <td>{customer.customerid}</td>
                <td>{customer.firstname}</td>
                <td>{customer.lastname}</td>
                <td>{customer.email}</td>
                <td>
                  <button onClick={() => { setEditCustomerData(customer); setShowCustomerForm(true); }}>Edit</button>
                  <button onClick={() => deleteCustomer(customer.customerid)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showCustomerForm && (
          <form onSubmit={createOrUpdateCustomer}>
            <input name="firstname" placeholder="First Name" required defaultValue={editCustomerData?.firstname || ''} />
            <input name="lastname" placeholder="Last Name" required defaultValue={editCustomerData?.lastname || ''} />
            <input name="email" placeholder="Email" required defaultValue={editCustomerData?.email || ''} />
            <button type="submit">{editCustomerData ? 'Save Changes' : 'Add Customer'}</button>
            <button type="button" onClick={() => hideForm(setShowCustomerForm, setEditCustomerData)}>Cancel</button>
          </form>
        )}
      </section>

      {/* Orders Section */}
      <section>
        <h2>Orders</h2>
        <button onClick={() => setShowOrderForm(true)}>Add New Order</button>
        <table border="1">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderid}>
                <td>{order.orderid}</td>
                <td>{order.customerid}</td>
                <td>{order.orderdate}</td>
                <td>{order.status}</td>
                <td>
                  <button onClick={() => { setEditOrderData(order); setShowOrderForm(true); }}>Edit</button>
                  <button onClick={() => deleteOrder(order.orderid)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showOrderForm && (
          <form onSubmit={createOrUpdateOrder}>
            <input name="customerid" placeholder="Customer ID" required defaultValue={editOrderData?.customerid || ''} />
            <input name="orderdate" type="date" required defaultValue={editOrderData?.orderdate || ''} />
            <input name="status" placeholder="Status" required defaultValue={editOrderData?.status || ''} />
            <button type="submit">{editOrderData ? 'Save Changes' : 'Add Order'}</button>
            <button type="button" onClick={() => hideForm(setShowOrderForm, setEditOrderData)}>Cancel</button>
          </form>
        )}
      </section>

      {/* Order Details Section */}
      <section>
        <h2>Order Details</h2>
        <button onClick={() => setShowOrderDetailForm(true)}>Add New Order Detail</button>
        <table border="1">
          <thead>
            <tr>
              <th>Order Detail ID</th>
              <th>Order ID</th>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((detail) => (
              <tr key={detail.orderdetailid}>
                <td>{detail.orderdetailid}</td>
                <td>{detail.orderid}</td>
                <td>{detail.productid}</td>
                <td>{detail.quantity}</td>
                <td>
                  <button onClick={() => { setEditOrderDetailData(detail); setShowOrderDetailForm(true); }}>Edit</button>
                  <button onClick={() => deleteOrderDetail(detail.orderdetailid)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showOrderDetailForm && (
          <form onSubmit={createOrUpdateOrderDetail}>
            <input name="orderid" placeholder="Order ID" required defaultValue={editOrderDetailData?.orderid || ''} />
            <input name="productid" placeholder="Product ID" required defaultValue={editOrderDetailData?.productid || ''} />
            <input name="quantity" type="number" required defaultValue={editOrderDetailData?.quantity || ''} />
            <button type="submit">{editOrderDetailData ? 'Save Changes' : 'Add Order Detail'}</button>
            <button type="button" onClick={() => hideForm(setShowOrderDetailForm, setEditOrderDetailData)}>Cancel</button>
          </form>
        )}
      </section>

      {/* Products Section */}
      <section>
        <h2>Products</h2>
        <button onClick={() => setShowProductForm(true)}>Add New Product</button>
        <table border="1">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productid}>
                <td>{product.productid}</td>
                <td>{product.productname}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>
                  <button onClick={() => { setEditProductData(product); setShowProductForm(true); }}>Edit</button>
                  <button onClick={() => deleteProduct(product.productid)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showProductForm && (
          <form onSubmit={createOrUpdateProduct}>
            <input name="productname" placeholder="Product Name" required defaultValue={editProductData?.productname || ''} />
            <input name="price" type="number" placeholder="Price" required defaultValue={editProductData?.price || ''} />
            <input name="category" placeholder="Category" required defaultValue={editProductData?.category || ''} />
            <button type="submit">{editProductData ? 'Save Changes' : 'Add Product'}</button>
            <button type="button" onClick={() => hideForm(setShowProductForm, setEditProductData)}>Cancel</button>
          </form>
        )}
      </section>
    </div>
  );
}
