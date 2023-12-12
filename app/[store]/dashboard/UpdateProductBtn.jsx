import Form from "./Form";

const UpdateProductBtn = (props) => {
  const { productData } = props;

  return <Form formTitle="Update" productData={productData} />;
};

export default UpdateProductBtn;
