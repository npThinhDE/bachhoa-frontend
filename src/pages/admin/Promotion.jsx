import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getPromotions } from "../api/api";

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    getPromotions().then((res) => setPromotions(res.data));
  }, []);

  return (
    <Layout>
      <h4>Khuyến mãi</h4>
      <table className="table table-bordered table-hover bg-white">
        <thead>
          <tr><th>ID</th><th>Sản phẩm</th><th>Giá giảm</th></tr>
        </thead>
        <tbody>
          {promotions.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.productName}</td>
              <td>{p.discountPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Promotions;
