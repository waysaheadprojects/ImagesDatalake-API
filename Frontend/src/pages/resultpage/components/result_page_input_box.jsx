import {
  GlobeAltIcon,
  PaperClipIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import { MicrophoneIcon } from "@heroicons/react/24/outline";
import { BookOpenIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const ResultaPageInputBox = ({ loading, data, setData, handleSubmit }) => {
  return (
    <div className=" w-full max-w-[650px]  transition-all duration-300 fixed bottom-0  z-50 pb-4 ml-[125px]">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center border border-gray-300 rounded-xl shadow-sm bg-neutral-50 px-4 py-2">
          <div className="flex items-center space-x-2 pr-4 border-r border-gray-300">
            <button className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md bg-white text-blue-400 border border-blue-200">
              <MagnifyingGlassIcon className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md text-gray-500">
              <BookOpenIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 flex items-center px-4 ">
            <textarea
              rows="1"
              value={data}
              placeholder="Ask anything..."
              onChange={(e) => setData(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              className="w-full resize-none border-none outline-none text-base bg-neutral-50 placeholder:text-neutral-700 leading-tight"
            ></textarea>
          </div>
          {/* Right Icons */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-300">
            <GlobeAltIcon className="w-5 h-5 text-gray-500" />
            <PaperClipIcon className="w-5 h-5 text-gray-500" />
            <MicrophoneIcon className="w-5 h-5 text-gray-500" />
            <button
              type="submit"
              className="flex items-center justify-center bg-teal-600 text-white rounded-full w-9 h-9 hover:bg-teal-700"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>

      {loading && (
        <div className="text-center my-5 flex items-center justify-center gap-2">
          <ArrowPathIcon className="w-5 h-5 text-gray-500 animate-spin" />
          <span  className="text-sm italic"> Thinking...</span>
        </div>
      )}
    </div>
  );
};

export default ResultaPageInputBox;
