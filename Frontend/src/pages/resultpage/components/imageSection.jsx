const renderImages = ({imageData}) => {
  // Flatten all web_photos from all items into a single array
  const allExternalImages = imageData?.images?.flatMap(item => item.web_photos || []) || [];
  
  // Flatten all local_photos from all items into a single array
  const allInternalImages = imageData?.images?.flatMap(item => item.local_photos || []) || [];

  return (
    <div className="w-full flex flex-wrap gap-4">

      {/* Internal Images */}
      {allInternalImages.length > 0 && (
        <>
          <h3 className="w-full text-md font-semibold mt-6 mb-2">Internal</h3>
          {allInternalImages.map((dataUri, i) => (
            <img
              key={`internal-${i}`}
              src={dataUri}
              alt={`internal-${i}`}
              className="w-40 h-40 object-cover rounded border-2 border-blue-500"
            />
          ))}
        </>
      )}

       {/* External Images */}
      {allExternalImages.length > 0 && (
        <>
          <h3 className="w-full text-md font-semibold mb-2">External</h3>
          {allExternalImages.map((url, i) => (
            <img
              key={`external-${i}`}
              src={url}
              alt={`external-${i}`}
              className="w-40 h-40 object-cover rounded"
            />
          ))}
        </>
      )}
    </div>
  );
};

export default renderImages;