 const renderVideos = ({videoData}) => (
    <div className="w-full flex flex-wrap gap-4">
      {videoData?.videos?.map((video, i) => {
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
      })}
    </div>
  );

  export default renderVideos;