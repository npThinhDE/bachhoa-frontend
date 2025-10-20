import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getCustomers } from "../api/api";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomers().then((res) => setCustomers(res.data));
  }, []);

  return (
    <Layout>
      <h4>Khách hàng</h4>
      <table className="table table-bordered table-hover bg-white">
        <thead>
          <tr><th>ID</th><th>Tên</th><th>Email</th><th>SĐT</th></tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Customers;
