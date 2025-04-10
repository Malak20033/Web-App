// src/components/Customers.js
import { useState, useEffect } from 'react';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ firstname: '', lastname: '', email: '' });

  // Fetch customers from the backend
  useEffect(() => {
    async function fetchCustomers() {
      const response = await fetch('/api/customers');
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
      const addedCustomer = await response.json();
      setCustomers([...customers, addedCustomer]);
    }
  }

  // Delete a customer
  async function deleteCustomer(customerid) {
    const response = await fetch(`/api/customers/${customerid}`, { method: 'DELETE' });
    if (response.ok) {
      setCustomers(customers.filter(customer => customer.customerid !== customerid));
    }
  }

  return (
    <div>
      <h2>Customers</h2>
      <ul>
        {customers.map(customer => (
          <li key={customer.customerid}>
            {customer.firstname} {customer.lastname} ({customer.email})
            <button onClick={() => deleteCustomer(customer.customerid)}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={addCustomer}>
        <input
          type="text"
          placeholder="First Name"
          value={newCustomer.firstname}
          onChange={e => setNewCustomer({ ...newCustomer, firstname: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newCustomer.lastname}
          onChange={e => setNewCustomer({ ...newCustomer, lastname: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newCustomer.email}
          onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
        />
        <button type="submit">Add Customer</button>
      </form>
    </div>
  );
}

export default Customers;