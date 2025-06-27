import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative">
        <style>
          {`
            .loader {
              width: 70px;
              height: 70px;
              position: relative;
            }

            .loader:before,
            .loader:after {
              content: '';
              position: absolute;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              animation: pulse 1.5s ease-in-out infinite;
            }

            .loader:before {
              background: #7C0000;
              animation-delay: -0.5s;
            }

            .loader:after {
              background: #0B171F;
            }

            @keyframes pulse {
              0%, 100% {
                transform: scale(0);
                opacity: 1;
              }
              50% {
                transform: scale(1);
                opacity: 0.25;
              }
            }

            .loading-text {
              animation: shimmer 1.5s ease-in-out infinite;
            }

            @keyframes shimmer {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.5;
              }
            }
          `}
        </style>

        <div className="flex flex-col items-center">
          <div className="loader mb-4"></div>
          <div className="text-lg font-bold text-[#7C0000] loading-text">
            جاري التحميل...
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading; 