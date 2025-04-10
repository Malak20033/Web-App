import { useState, useEffect } from 'react';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ firstname: '', lastname: '', email: '' });
  const [editCustomer, setEditCustomer] = useState(null); // For updating customers

  // Fetch customers from the API
  useEffect(() => {
    async function fetchCustomers() {
      const response = await fetch('/api/customers'); // API route for fetching customer data
      const data = await response.json();
      setCustomers(data);
    }
    fetchCustomers();
  }, []);

  // Add a new customer
  async function addCustomer(event) {
    event.preventDefault();
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCustomer),
    });
    if (response.ok) {
      const customer = await response.json();
      setCustomers([...customers, customer]); // Update the list with the new customer
      setNewCustomer({ firstname: '', lastname: '', email: '' }); // Clear the form
    }
  }

  // Update an existing customer
  async function updateCustomer(event) {
    event.preventDefault();
    const response = await fetch(`/api/customers/${editCustomer.customerid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editCustomer),
    });
    if (response.ok) {
      const updatedCustomer = await response.json();
      setCustomers(customers.map(customer =>
        customer.customerid === updatedCustomer.customerid ? updatedCustomer : customer
      ));
      setEditCustomer(null); // Exit edit mode
    }
  }

  // Delete a customer
  async function deleteCustomer(customerid) {
    const response = await fetch(`/api/customers/${customerid}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setCustomers(customers.filter(customer => customer.customerid !== customerid)); // Remove from the list
    }
  }

  return (
    <div>
      <h2>Customer List</h2>
      <ul>
        {customers.map(customer => (
          <li key={customer.customerid}>
            {customer.firstname} {customer.lastname} ({customer.email})
            <button onClick={() => setEditCustomer(customer)}>Edit</button>
            <button onClick={() => deleteCustomer(customer.customerid)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Add New Customer</h3>
      <form onSubmit={addCustomer}>
        <input
          type="text"
          placeholder="First Name"
          value={newCustomer.firstname}
          onChange={e => setNewCustomer({ ...newCustomer, firstname: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newCustomer.lastname}
          onChange={e => setNewCustomer({ ...newCustomer, lastname: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newCustomer.email}
          onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
          required
        />
        <button type="submit">Add Customer</button>
      </form>

      {editCustomer && (
        <div>
          <h3>Edit Customer</h3>
          <form onSubmit={updateCustomer}>
            <input
              type="text"
              placeholder="First Name"
              value={editCustomer.firstname}
              onChange={e => setEditCustomer({ ...editCustomer, firstname: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={editCustomer.lastname}
              onChange={e => setEditCustomer({ ...editCustomer, lastname: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={editCustomer.email}
              onChange={e => setEditCustomer({ ...editCustomer, email: e.target.value })}
              required
            />
            <button type="submit">Update Customer</button>
            <button type="button" onClick={() => setEditCustomer(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CustomerList
