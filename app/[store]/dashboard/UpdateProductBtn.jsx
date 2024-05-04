import Form from "./Form";

const UpdateProductBtn = (props) => {
  const { productData, storeData } = props;

  return <Form formTitle="Update" productData={productData} storeData={storeData}/>;
};

export default UpdateProductBtn;
