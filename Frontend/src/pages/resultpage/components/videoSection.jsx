const renderVideos = ({ videoData }) => {
  const internalVideos = videoData?.videos?.internal || [];
  const externalVideos = videoData?.videos?.external || [];

  const renderVideoList = (videos) => {
    return videos.map((video, i) => {
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
    });
  };

  const hasAnyVideos = internalVideos.length > 0 || externalVideos.length > 0;

  return (
    <div className="w-full">
      {hasAnyVideos ? (
        <div className="flex flex-col gap-10">
          {internalVideos.length > 0 && (
            <div>
              {/* <h2 className="text-lg font-semibold mb-4">Internal</h2> */}
              <div className="flex flex-wrap gap-4">{renderVideoList(internalVideos)}</div>
            </div>
          )}

          {/* {externalVideos.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">External</h2>
              <div className="flex flex-wrap gap-4">{renderVideoList(externalVideos)}</div>
            </div>
          )} */}
        </div>
      ) : (
        <div className="text-center text-gray-600 mt-12 text-lg max-w-xl mx-auto leading-relaxed italic">
          I couldn’t bring up any results just yet — but every detail stays safe here if you’d like to refine and search once more.
        </div>
      )}
    </div>
  );
};

export default renderVideos;
