// import { useEffect, useState } from "react";

// const RenderImages = ({imageData}) => {
//   // Flatten all web_photos from all items into a single array
//   const allExternalImages = imageData?.images?.flatMap(item => item.web_photos || []) || [];
  
//   // Flatten all local_photos from all items into a single array
//   const allInternalImages = imageData?.images?.flatMap(item => item.local_photos || []) || [];

//   const [visibleInternalCount, setVisibleInternalCount] = useState(0);

//   useEffect(() => {
//     let timeouts = [];

//     setVisibleInternalCount(0); // Reset on new data

//     allInternalImages.forEach((_, i) => {
//       const timeout = setTimeout(() => {
//         setVisibleInternalCount(prev => prev + 1);
//       }, i * 100); // 100ms delay between each image
//       timeouts.push(timeout);
//     });

//     return () => {
//       timeouts.forEach(clearTimeout); // Cleanup
//     };
//   }, [imageData]);
//   console.log(allInternalImages,"All Internal Images"  )
//   return (
//     <div className="w-full flex flex-wrap gap-4">

//       {/* Internal Images */}
//       {allInternalImages.length > 0 && (
//         <>
//           {/* <h3 className="w-full text-md font-semibold mt-6 mb-2">Internal</h3> */}
//           {/* {allInternalImages.map((dataUri, i) => (
//             <img
//               key={`internal-${i}`}
//               src={dataUri}
//               alt={`internal-${i}`}
//               className="w-40 h-40 object-cover rounded border-2 border-blue-500"
//             />
//           ))} */}
//           {allInternalImages.slice(0, visibleInternalCount).map((dataUri, i) => (
//             <img
//               key={`internal-${i}`}
//               src={dataUri}
//               alt={`internal-${i}`}
//               className="w-40 h-40 object-cover rounded border-2 border-blue-500 transition-opacity duration-300"
//             />
//           ))}
//         </>
//       )}

//        {/* External Images */}
//       {allExternalImages.length > 0 && (
//         <>
//           <h3 className="w-full text-md font-semibold mb-2">External</h3>
//           {allExternalImages.map((url, i) => (
//             <img
//               key={`external-${i}`}
//               src={url}
//               alt={`external-${i}`}
//               className="w-40 h-40 object-cover rounded"
//             />
//           ))}
//         </>
//       )}
//     </div>
//   );
// };

// export default RenderImages;


import { useEffect, useState } from "react";
import { HiDownload } from "react-icons/hi";
import { GET_REQUEST } from "../../../api";

const RenderImages = ({ imageData }) => {
  const allExternalImages = imageData?.images?.flatMap(item => item.web_photos || []) || [];
  const allInternalImages = imageData?.images?.flatMap(item => item.local_photos || []) || [];

  const [visibleInternalCount, setVisibleInternalCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null); // For modal
  const [modalVisible, setModalVisible] = useState(false);
  const[downloadImage,setDownloadImage]=useState(null);
  const [mediumResolution,setMediumResolution]=useState(null);


  useEffect(() => {
    let timeouts = [];
    setVisibleInternalCount(0);
    allInternalImages.forEach((_, i) => {
      const timeout = setTimeout(() => {
        setVisibleInternalCount(prev => prev + 1);
      }, i * 100);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [imageData]);
console.log(imageData?.images,"All Internal Images"  )
  // Simulated API call
  const handleImageClick = async (imageSrc) => {
    // Simulate an API call delay
    console.log(imageSrc,"Images")
    

    const response=await GET_REQUEST("https://images-api.retailopedia.com/get_image_medium", {
      image_key: imageSrc,
    });
    console.log(response,"response")
// await new Promise(res => setTimeout(res, 300));
    // Set selected image and show modal
    setMediumResolution(response?.image_base64);
    setModalVisible(true);

     const highResolutionResponse=await GET_REQUEST("https://images-api.retailopedia.com/get_image_full", {
      image_key: imageSrc,
    });
    setDownloadImage(highResolutionResponse?.image_base64);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = downloadImage;
    link.download = 'downloaded-image.jpg';
    link.click();
  };
return (
  <>
    {/* Show fallback message if no images exist */}
    {!imageData?.images ||
    imageData.images.length === 0 ||
    imageData.images.every(p => !p.groups || p.groups.length === 0) ? (
      <div className="text-center text-gray-600 text-lg mt-8">
        I couldn’t bring up any results just yet — but every detail stays safe here if you’d like to refine and search once more.
      </div>
    ) : (
      <>
        {/* Existing image rendering logic here */}
        <div className="w-full flex flex-wrap gap-4">
          {imageData?.images?.map((person, personIndex) => (
            <div key={personIndex}>
              {person.groups?.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {group.tag
                      .replace(/rupam bhattacharjee/gi, '')
                      .trim()
                      .toUpperCase()
                      .split(',')
                      .map((tag, i) => {
                        const cleanedTag = tag.trim();
                        return cleanedTag ? (
                          <span
                            key={i}
                            className="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full"
                          >
                            #{cleanedTag}
                          </span>
                        ) : null;
                      })}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {group.images?.map((img, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={img.base64}
                        alt={`img-${img.image_key}`}
                        className="w-40 h-40 object-cover rounded border-2 border-blue-500 cursor-pointer transition-opacity duration-300"
                        onClick={() => handleImageClick(img.image_key)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </>
    )}

    {/* Modal code below remains unchanged */}
    {modalVisible && (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center">
        <div className="absolute top-0 left-0 right-0 flex justify-end items-center p-4 bg-black bg-opacity-60 z-[9999]">
          <HiDownload
            className="text-white text-2xl hover:opacity-80 cursor-pointer mr-4"
            onClick={handleDownload}
            title="Download"
          />
          <button
            onClick={() => setModalVisible(false)}
            className="text-white text-3xl hover:opacity-80"
            title="Close"
          >
            &times;
          </button>
        </div>
        <div className="max-w-[90vw] max-h-[90vh] p-4 flex items-center justify-center">
          <img
            src={mediumResolution}
            alt="Selected"
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
          />
        </div>
      </div>
    )}
  </>
);

//   return (
//     <>
//       <div className="w-full flex flex-wrap gap-4">
//         {/* Internal Images */}
//         {/* {allInternalImages.length > 0 && (
//           <>
//             {allInternalImages.slice(0, visibleInternalCount).map((dataUri, i) => (
//               <img
//                 key={`internal-${i}`}
//                 src={dataUri}
//                 alt={`internal-${i}`}
//                 className="w-40 h-40 object-cover rounded border-2 border-blue-500 cursor-pointer transition-opacity duration-300"
//                 onClick={() => handleImageClick(dataUri)}
//               />
//             ))}
//           </>
//         )} */}

//         {imageData?.images?.map((person, personIndex) => (
//   <div key={personIndex}>
//     {person.groups?.map((group, groupIndex) => (
//       <div key={groupIndex} className="mb-4">
//         {/* <h3 className="text-md font-medium mb-1">
//            {group.tag
//     .replace(/rupam bhattacharjee/gi, '')
//     .trim()
//     .toUpperCase()}
//         </h3> */}
//     <div className="flex flex-wrap gap-2 mb-4">
//   {group.tag
//     .replace(/rupam bhattacharjee/gi, '')
//     .trim()
//     .toUpperCase()
//     .split(',')
//     .map((tag, i) => {
//       const cleanedTag = tag.trim();
//       return cleanedTag ? (
//         <span
//           key={i}
//           className="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full"
//         >
//           #{cleanedTag}
//         </span>
//       ) : null;
//     })}
// </div>

//         <div className="flex flex-wrap gap-4">
//           {group.images?.map((img, imgIndex) => (
//             <img
//               key={imgIndex}
//               src={img.base64}
//               alt={`img-${img.image_key}`}
//               className="w-40 h-40 object-cover rounded border-2 border-blue-500 cursor-pointer transition-opacity duration-300"
//                 onClick={() => handleImageClick(img.image_key)}
//             />
//           ))}
//         </div>
//       </div>
//     ))}
//   </div>
// ))}

//       </div>

//       {/* Modal */}
//       {/* {modalVisible && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//           <div className="bg-white p-4 rounded-lg relative max-w-md w-full">
//             <button
//               onClick={() => setModalVisible(false)}
//               className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
//             >
//               &times;
//             </button>
//             <img src={selectedImage} alt="Selected" className="w-full max-h-[60vh] object-contain" />
//             <div className="text-center mt-4">
//               <button
//                 onClick={handleDownload}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//               >
//                 ⬇ Download
//               </button>
//             </div>
//           </div>
//         </div>
//       )} */}

//    {modalVisible && (
//   <div className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center">
//     {/* Top Action Bar */}
//     <div className="absolute top-0 left-0 right-0 flex justify-end items-center p-4 bg-black bg-opacity-60 z-[9999]">
//       {/* Download Button */}
//       {/* <button
//         onClick={handleDownload}
//         className="text-white text-xl mr-4 hover:opacity-80"
//         title="Download"
//       > */}
//      <HiDownload className="text-white text-2xl hover:opacity-80 cursor-pointer mr-4" onClick={handleDownload} title="Download" />

//       {/* </button> */}

//       {/* Close Button */}
//       <button
//         onClick={() => setModalVisible(false)}
//         className="text-white text-3xl hover:opacity-80"
//         title="Close"
//       >
//         &times;
//       </button>
//     </div>

//     {/* Centered Image */}
//     <div className="max-w-[90vw] max-h-[90vh] p-4 flex items-center justify-center">
//       <img
//         src={mediumResolution}
//         alt="Selected"
//         className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
//       />
//     </div>
//   </div>
// )}


//     </>
//   );
};

export default RenderImages;
