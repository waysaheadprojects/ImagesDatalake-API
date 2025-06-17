import "../style.css"

const renderAnswer = ({typedAnswer}) => {
  return (
    <div
      className="w-full text-gray-700 answer ml-4"
      dangerouslySetInnerHTML={{ __html: typedAnswer }}
    />
  );
};
export default renderAnswer;