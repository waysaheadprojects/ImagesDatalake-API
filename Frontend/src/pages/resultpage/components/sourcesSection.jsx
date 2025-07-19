  // const renderSources = ({sourceData}) => (
  //   <ul className="w-full list-disc ml-5 space-y-2 items-start mx-16">
  //     {sourceData?.sources?.map((src, i) => (
  //       <li key={i}>
  //         <a
  //           href={src.signed_url}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           className="text-blue-500 text-md cursor-pointer"
  //         >
  //           {src.source}
  //         </a>
  //       </li>
  //     ))}
  //   </ul>
  // );

  // export default renderSources;


  const renderSources = ({ sourceData }) => {
  const hasSources = sourceData?.sources?.length > 0;

  return (
    <div className="w-full mx-16">
      {hasSources ? (
        <ul className="list-disc ml-5 space-y-2 items-start">
          {sourceData.sources.map((src, i) => (
            <li key={i}>
              <a
                href={src.signed_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-md cursor-pointer"
              >
                {src.source}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-600 mt-8 text-lg italic">
         I couldn’t bring up any results just yet — but every detail stays safe here if you’d like to refine and search once more.
        </div>
      )}
    </div>
  );
};

export default renderSources;
