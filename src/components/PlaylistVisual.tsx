import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {COLORS, FONTS} from '../constants';

const SECULAR_TRACKS = [
  {title: 'Money Rain', artist: 'Trap Lord', duration: '3:24'},
  {title: 'No Soul', artist: 'Dark Wave', duration: '2:58'},
  {title: 'Hollow', artist: 'Night Shift', duration: '4:01'},
  {title: 'Burnin\' Up', artist: 'Vice City', duration: '3:47'},
  {title: 'Lust Season', artist: 'The Agenda', duration: '3:12'},
  {title: 'Numb All Day', artist: 'Low Tide', duration: '5:03'},
  {title: 'Game Over', artist: 'Xero Corp', duration: '2:44'},
];

const WORSHIP_TRACKS = [
  {title: 'Way Maker', artist: 'Sinach', duration: '5:14'},
  {title: 'Goodness of God', artist: 'Bethel Music', duration: '6:22'},
  {title: 'Oceans', artist: 'Hillsong United', duration: '8:56'},
  {title: 'Graves Into Gardens', artist: 'Elevation', duration: '5:47'},
  {title: 'What a Beautiful Name', artist: 'Hillsong', duration: '5:41'},
  {title: 'Reckless Love', artist: 'Cory Asbury', duration: '5:24'},
  {title: 'King of Kings', artist: 'Hillsong', duration: '6:28'},
];

interface TrackItemProps {
  title: string;
  artist: string;
  duration: string;
  index: number;
  delay: number;
  isActive?: boolean;
  type: 'secular' | 'worship';
}

const TrackItem: React.FC<TrackItemProps> = ({title, artist, duration, index, delay, isActive, type}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = Math.max(0, frame - delay - index * 4);

  const opacity = spring({fps, frame: localFrame, config: {damping: 200, stiffness: 200}, from: 0, to: 1});
  const translateX = spring({fps, frame: localFrame, config: {damping: 100, stiffness: 200, mass: 0.8},
    from: type === 'secular' ? -30 : 30, to: 0});

  const accentColor = type === 'worship' ? COLORS.gold : '#ef4444';
  const albumBg = type === 'worship'
    ? `linear-gradient(135deg, #1a3a2a, #2d5a3d)`
    : `linear-gradient(135deg, #2a1a1a, #3d1a1a)`;

  return (
    <div style={{
      opacity,
      transform: `translateX(${translateX}px)`,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '10px 16px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: isActive ? `rgba(${type === 'worship' ? '245,158,11' : '239,68,68'},0.08)` : 'transparent',
      borderLeft: isActive ? `3px solid ${accentColor}` : '3px solid transparent',
    }}>
      {/* Album art placeholder */}
      <div style={{
        width: 42, height: 42, borderRadius: 4, flexShrink: 0,
        background: albumBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
        boxShadow: `0 0 10px ${accentColor}33`,
      }}>
        {type === 'worship' ? '✝' : '♪'}
      </div>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{
          color: isActive ? accentColor : COLORS.white,
          fontFamily: FONTS.body, fontSize: 15, fontWeight: 600,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{title}</div>
        <div style={{
          color: 'rgba(255,255,255,0.45)', fontFamily: FONTS.body, fontSize: 12,
          marginTop: 2,
        }}>{artist}</div>
      </div>
      <div style={{color: 'rgba(255,255,255,0.3)', fontFamily: FONTS.body, fontSize: 12, flexShrink: 0}}>
        {duration}
      </div>
    </div>
  );
};

interface PlaylistVisualProps {
  type?: 'secular' | 'worship' | 'split';
  delay?: number;
  activeIndex?: number;
  title?: string;
}

// Styled playlist UI — mimics a streaming app. For split view, shows secular → worship transformation
export const PlaylistVisual: React.FC<PlaylistVisualProps> = ({
  type = 'secular',
  delay = 0,
  activeIndex = 1,
  title,
}) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - delay);

  const containerOpacity = interpolate(localFrame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const scale = interpolate(localFrame, [0, 30], [0.92, 1], {extrapolateRight: 'clamp'});

  if (type === 'split') {
    return (
      <div style={{display: 'flex', gap: 40, opacity: containerOpacity, transform: `scale(${scale})`}}>
        <PlaylistCard tracks={SECULAR_TRACKS} type="secular" delay={delay} activeIndex={activeIndex} title="My Playlist" />
        <PlaylistCard tracks={WORSHIP_TRACKS} type="worship" delay={delay + 20} activeIndex={activeIndex} title="Worship Playlist" />
      </div>
    );
  }

  const tracks = type === 'worship' ? WORSHIP_TRACKS : SECULAR_TRACKS;
  return (
    <PlaylistCard
      tracks={tracks}
      type={type}
      delay={delay}
      activeIndex={activeIndex}
      title={title ?? (type === 'worship' ? 'Worship Playlist' : 'My Playlist')}
    />
  );
};

const PlaylistCard: React.FC<{
  tracks: typeof SECULAR_TRACKS;
  type: 'secular' | 'worship';
  delay: number;
  activeIndex: number;
  title: string;
}> = ({tracks, type, delay, activeIndex, title}) => {
  const accentColor = type === 'worship' ? COLORS.gold : '#ef4444';
  const headerGrad = type === 'worship'
    ? `linear-gradient(135deg, #1a2e1a, #2d4a1a)`
    : `linear-gradient(135deg, #1a0a0a, #2d1a0a)`;

  return (
    <div style={{
      width: 360,
      background: 'rgba(15,15,20,0.95)',
      borderRadius: 12,
      overflow: 'hidden',
      border: `1px solid ${accentColor}22`,
      boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${accentColor}11`,
    }}>
      <div style={{
        padding: '20px 20px 16px',
        background: headerGrad,
        borderBottom: `1px solid ${accentColor}22`,
      }}>
        <div style={{fontFamily: FONTS.body, fontSize: 12, color: accentColor, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4}}>
          {type === 'worship' ? '✦ Playlist' : '♫ Playlist'}
        </div>
        <div style={{fontFamily: FONTS.body, fontSize: 20, fontWeight: 700, color: COLORS.white}}>{title}</div>
        <div style={{fontFamily: FONTS.body, fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4}}>
          {tracks.length} songs
        </div>
      </div>
      <div>
        {tracks.slice(0, 6).map((track, i) => (
          <TrackItem
            key={i}
            {...track}
            index={i}
            delay={delay}
            type={type}
            isActive={i === activeIndex}
          />
        ))}
      </div>
    </div>
  );
};
