  const renderSources = ({sourceData}) => (
    <ul className="w-full list-disc ml-5 space-y-2 items-start mx-16">
      {sourceData?.sources?.map((src, i) => (
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
  );

  export default renderSources;