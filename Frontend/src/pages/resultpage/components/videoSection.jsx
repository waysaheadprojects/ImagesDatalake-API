//  const renderVideos = ({videoData}) => (




//     <div className="w-full flex flex-wrap gap-4">
//       {videoData?.videos?.map((video, i) => {
//         const videoId = video.video_url.split("v=")[1]?.split("&")[0];
//         const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
//         return (
//           <div key={i} className="w-48">
//             <a href={video.video_url} target="_blank" rel="noopener noreferrer">
//               <img
//                 src={thumbnail}
//                 alt={video.title}
//                 className="w-full h-28 object-cover rounded mb-2"
//               />
//             </a>
//             <p className="text-sm text-gray-700">{video.title}</p>
//           </div>
//         );
//       })}
//     </div>
//   );

//   export default renderVideos;


const renderVideos = ({ videoData }) => {
  const hasVideos = videoData?.videos?.length > 0;

  return (
    <div className="w-full flex flex-wrap gap-4">
      {hasVideos ? (
        videoData.videos.map((video, i) => {
          const videoId = video.video_url.split("v=")[1]?.split("&")[0];
          const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          return (
            <div key={i} className="w-48">
              <a href={video.video_url} target="_blank" rel="noopener noreferrer">
                <img
                  src={thumbnail}
                  alt={video.title}
                  className="w-full h-28 object-cover rounded mb-2"
                />
              </a>
              <p className="text-sm text-gray-700">{video.title}</p>
            </div>
          );
        })
      ) : (
        <div className="text-center text-gray-600 mt-12 text-lg max-w-xl mx-auto leading-relaxed italic">
         I couldn’t bring up any results just yet — but every detail stays safe here if you’d like to refine and search once more.
        </div>
      )}
    </div>
  );
};

export default renderVideos;
