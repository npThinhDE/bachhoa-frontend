import Layout from "../components/Layout";

const Settings = () => {
  return (
    <Layout>
      <h4>Cài đặt hệ thống</h4>
      <form className="bg-white p-4 rounded shadow-sm" style={{ maxWidth: 600 }}>
        <div className="mb-3">
          <label className="form-label">Tên cửa hàng</label>
          <input className="form-control" defaultValue="Bách Hóa Online" />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" defaultValue="admin@bachhoa.vn" />
        </div>
        <div className="mb-3">
          <label className="form-label">Số điện thoại</label>
          <input className="form-control" defaultValue="0123456789" />
        </div>
        <button className="btn btn-primary">Lưu thay đổi</button>
      </form>
    </Layout>
  );
};

export default Settings;
