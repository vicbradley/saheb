import Form from "./Form";

const UpdateProductBtn = (props) => {
  const { productData, storeData } = props;

  return <Form formTitle="Edit" productData={productData} storeData={storeData}/>;
};

export default UpdateProductBtn;
