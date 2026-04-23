import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, Maximize, SkipBack, SkipForward } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  onTimeUpdate?: (currentTime: number) => void;
  jumpToTime?: number;
  onVideoReady?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onTimeUpdate, jumpToTime, onVideoReady }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentVideoUrlRef = useRef<string>('');

  // Reset video ready state when video URL changes
  useEffect(() => {
    if (videoUrl !== currentVideoUrlRef.current) {
      console.log('Video URL changed from', currentVideoUrlRef.current, 'to', videoUrl);
      setIsVideoReady(false);
      setIsPlaying(false);
      setVideoError(false);
      setCurrentTime(0);
      setDuration(0);
      currentVideoUrlRef.current = videoUrl;
      
      // Force video element to load new source
      if (videoRef.current) {
        videoRef.current.load();
      }
    }
  }, [videoUrl]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isSeeking) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsVideoReady(true);
      setVideoError(false);
      console.log('Video metadata loaded, duration:', videoRef.current.duration);
      onVideoReady?.();
    }
  };

  const handleVideoError = () => {
    console.error('Video failed to load:', videoUrl);
    setVideoError(true);
    setIsVideoReady(false);
  };

  const handleCanPlay = () => {
    console.log('Video can play');
    setIsVideoReady(true);
    setVideoError(false);
    onVideoReady?.();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    console.log('Video path:', videoUrl);
    console.log('Seeking to:', time, 'Video playing:', isPlaying);
    
    if (videoRef.current) {
      // Pause video before seeking if playing
      const wasPlaying = !videoRef.current.paused;
      if (wasPlaying) {
        videoRef.current.pause();
      }
      
      // Set seeking flag to prevent timeUpdate interference
      setIsSeeking(true);
      
      // Update the slider immediately for responsiveness
      setCurrentTime(time);
      
      // Simple direct seek
      videoRef.current.currentTime = time;
      console.log('Video currentTime set to:', videoRef.current.currentTime);
      
      // Wait for seek to complete, then resume if it was playing
      setTimeout(() => {
        if (videoRef.current) {
          const actualTime = videoRef.current.currentTime;
          console.log('Actual time after seek:', actualTime);
          
          // Clear seeking flag
          setIsSeeking(false);
          
          // Resume if it was playing
          if (wasPlaying) {
            videoRef.current.play().catch(err => console.log('Play error:', err));
          }
        }
      }, 100);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
      if (newMuted) {
        setVolume(0);
      } else {
        setVolume(videoRef.current.volume || 1);
      }
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      // YouTube format for videos over 1 hour: H:MM:SS
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    // YouTube format for videos under 1 hour: M:SS
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Jump to specific time when requested
  React.useEffect(() => {
    if (jumpToTime !== undefined && videoRef.current && isVideoReady) {
      console.log('Jumping to time:', jumpToTime, 'Video ready:', isVideoReady);
      videoRef.current.currentTime = jumpToTime;
      setCurrentTime(jumpToTime);
    }
  }, [jumpToTime, isVideoReady]);

  return (
    <div className="relative bg-black rounded-xl overflow-hidden group">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onLoadedData={handleCanPlay}
        onCanPlay={handleCanPlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={handleVideoError}
        preload="metadata"
        key={videoUrl}
      >
        Your browser does not support the video tag.
      </video>

      {/* Loading indicator */}
      {!isVideoReady && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="text-white text-center">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm opacity-80">Loading video...</p>
          </div>
        </div>
      )}

      {/* Error indicator */}
      {videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="text-white text-center">
            <p className="text-sm mb-3 opacity-80">Failed to load video</p>
            <button 
              onClick={() => {
                setVideoError(false);
                if (videoRef.current) {
                  videoRef.current.load();
                }
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Custom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 opacity-100 transition-opacity duration-300">
        {/* Progress Bar - YouTube Style */}
        <div className="mb-3">
          <div 
            className="relative w-full h-1.5 bg-white/30 rounded-lg cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = x / rect.width;
              const time = percentage * duration;
              if (videoRef.current) {
                const wasPlaying = !videoRef.current.paused;
                if (wasPlaying) {
                  videoRef.current.pause();
                }
                setIsSeeking(true);
                setCurrentTime(time);
                videoRef.current.currentTime = time;
                console.log('Clicked to seek to:', time);
                
                setTimeout(() => {
                  setIsSeeking(false);
                  if (wasPlaying) {
                    videoRef.current?.play().catch(err => console.log('Play error:', err));
                  }
                }, 100);
              }
            }}
          >
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              onInput={handleSeek}
              className="w-full h-1.5 bg-transparent rounded-lg appearance-none cursor-pointer slider absolute inset-0"
              style={{
                background: `linear-gradient(to right, #3b82f6 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%)`
              }}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="text-white hover:text-white transition-colors duration-200"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <div className="bg-black/[0.005] backdrop-blur-xl rounded-full px-3 py-1.5">
              <span className="text-xs text-white/90 font-mono" style={{ minWidth: '120px' }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Volume Control - Always Visible */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="text-white/80 hover:text-white transition-colors duration-200"
              >
                {isMuted || volume === 0 ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, white ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) ${(isMuted ? 0 : volume) * 100}%)`
                }}
              />
            </div>

            <button 
              onClick={() => {
                if (videoRef.current) {
                  if (videoRef.current.requestFullscreen) {
                    videoRef.current.requestFullscreen();
                  } else if ((videoRef.current as any).webkitRequestFullscreen) {
                    (videoRef.current as any).webkitRequestFullscreen();
                  } else if ((videoRef.current as any).msRequestFullscreen) {
                    (videoRef.current as any).msRequestFullscreen();
                  }
                }
              }}
              className="text-white/80 hover:text-white transition-colors duration-200"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default VideoPlayer;