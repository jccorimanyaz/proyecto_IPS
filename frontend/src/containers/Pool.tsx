import Layout from "../hocs/Layout";
import PoolComponent from "../components/PoolComponent";

const Pool = () => {
  return (
    <Layout>
      <main className="content px-3 py-4">
        <PoolComponent />
      </main>
    </Layout>
  );
};

export default Pool;
