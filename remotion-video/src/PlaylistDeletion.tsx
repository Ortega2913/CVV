import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Easing,
} from "remotion";

/* ─── Timing (frames @ 30fps) ─────────────────────────── */
const SCENE = {
  hook: { start: 0, end: 120 },         // 0–4 s
  playlist: { start: 120, end: 330 },   // 4–11 s
  godSpeaks: { start: 330, end: 510 },  // 11–17 s
  delete: { start: 510, end: 690 },     // 17–23 s
  silence: { start: 690, end: 870 },    // 23–29 s
  peace: { start: 870, end: 1050 },     // 29–35 s
  renewed: { start: 1050, end: 1200 },  // 35–40 s
  cta: { start: 1200, end: 1350 },      // 40–45 s
};

const SONGS = [
  "1. Anxious Heart - Artist Unknown",
  "2. Late Night Tears",
  "3. Broken Inside",
  "4. Empty Nights",
  "5. Fading Away",
  "6. Lost In The Noise",
  "7. Old Wounds",
];

/* ─── Helpers ──────────────────────────────────────────── */
function useSpring(frame: number, fps: number, delay = 0) {
  return spring({ frame: frame - delay, fps, config: { damping: 12 } });
}

function fadeIn(frame: number, start: number, duration = 20) {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function fadeOut(frame: number, end: number, duration = 20) {
  return interpolate(frame, [end - duration, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function crossFade(frame: number, start: number, end: number) {
  return Math.min(fadeIn(frame, start), fadeOut(frame, end));
}

/* ─── Particle component ───────────────────────────────── */
const GoldParticles: React.FC<{ frame: number; count?: number }> = ({
  frame,
  count = 20,
}) => {
  const particles = Array.from({ length: count }, (_, i) => {
    const seed = i * 137.508;
    const x = ((seed * 17) % 100);
    const y = ((seed * 31) % 100);
    const size = 3 + (i % 4) * 2;
    const delay = (i % 10) * 3;
    const opacity = interpolate(
      frame,
      [delay, delay + 30, delay + 60],
      [0, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const rise = interpolate(frame, [delay, delay + 60], [0, -40], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { x, y, size, opacity, rise };
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "radial-gradient(circle, #FFD700, #FFA500)",
            opacity: p.opacity,
            transform: `translateY(${p.rise}px)`,
            boxShadow: `0 0 ${p.size * 2}px #FFD700`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/* ─── Scene 1 · HOOK ───────────────────────────────────── */
const SceneHook: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const opacity = crossFade(frame, 0, SCENE.hook.end);

  const line1Spring = useSpring(frame, fps, 10);
  const line2Spring = useSpring(frame, fps, 25);
  const subtitleSpring = useSpring(frame, fps, 50);

  const glowPulse = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.6, 1]
  );

  return (
    <AbsoluteFill
      style={{
        opacity,
        background:
          "radial-gradient(ellipse at 50% 40%, #0a1a2e 0%, #000814 70%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(100,150,255,0.15), transparent)",
          opacity: glowPulse,
        }}
      />

      {/* Main hook text */}
      <div
        style={{
          textAlign: "center",
          transform: `scale(${line1Spring})`,
          opacity: line1Spring,
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "Georgia, serif",
            letterSpacing: -2,
            textShadow: "0 0 40px rgba(150,180,255,0.8)",
            lineHeight: 1.1,
            display: "block",
          }}
        >
          God told me
        </span>
      </div>
      <div
        style={{
          textAlign: "center",
          transform: `scale(${line2Spring})`,
          opacity: line2Spring,
          marginBottom: 30,
        }}
      >
        <span
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#7eb8ff",
            fontFamily: "Georgia, serif",
            letterSpacing: -1,
            display: "block",
            lineHeight: 1.1,
          }}
        >
          to delete my playlist…
        </span>
      </div>
      <div
        style={{
          opacity: subtitleSpring,
          transform: `translateY(${interpolate(subtitleSpring, [0, 1], [20, 0])}px)`,
        }}
      >
        <span
          style={{
            fontSize: 42,
            color: "rgba(255,255,255,0.7)",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            textAlign: "center",
            display: "block",
          }}
        >
          and this is what happened.
        </span>
      </div>

      {/* Music note floating */}
      {[...Array(5)].map((_, i) => {
        const noteOpacity = interpolate(
          frame,
          [i * 10, i * 10 + 20, i * 10 + 50],
          [0, 0.5, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const noteY = interpolate(frame, [i * 10, i * 10 + 60], [0, -80], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${15 + i * 17}%`,
              bottom: "25%",
              opacity: noteOpacity,
              transform: `translateY(${noteY}px)`,
              fontSize: 36,
              color: "rgba(126, 184, 255, 0.7)",
            }}
          >
            ♪
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ─── Scene 2 · PLAYLIST ───────────────────────────────── */
const ScenePlaylist: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const localFrame = frame - SCENE.playlist.start;
  const opacity = crossFade(frame, SCENE.playlist.start, SCENE.playlist.end);

  const phoneScale = spring({ frame: localFrame, fps, config: { damping: 14 } });

  const anxietyPulse = interpolate(
    Math.sin(localFrame * 0.12),
    [-1, 1],
    [0.8, 1.05]
  );

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: "linear-gradient(180deg, #0d1b2a 0%, #0a0e1a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Red anxiety glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 700,
          borderRadius: 40,
          background: "radial-gradient(ellipse, rgba(180,0,0,0.2), transparent 70%)",
          opacity: anxietyPulse,
        }}
      />

      {/* Caption above phone */}
      <div
        style={{
          opacity: fadeIn(localFrame, 20, 25),
          marginBottom: 30,
          textAlign: "center",
        }}
      >
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 32, fontFamily: "Georgia, serif", margin: 0 }}>
          Every day I was feeding my mind…
        </p>
      </div>

      {/* Phone mockup */}
      <div
        style={{
          transform: `scale(${phoneScale * 0.85})`,
          position: "relative",
          width: 320,
          borderRadius: 40,
          overflow: "hidden",
          boxShadow: `0 0 60px rgba(180,0,50,${anxietyPulse * 0.5}), 0 20px 80px rgba(0,0,0,0.8)`,
          border: "3px solid rgba(255,255,255,0.1)",
        }}
      >
        <img
          src="playlist.jpg"
          style={{ width: "100%", display: "block" }}
          alt="Dark playlist"
        />
        {/* Red overlay flicker */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(180,0,0,0.1)",
            opacity: Math.sin(localFrame * 0.2) > 0.8 ? 0.3 : 0,
          }}
        />
      </div>

      {/* Anxiety labels */}
      <div
        style={{
          marginTop: 30,
          opacity: fadeIn(localFrame, 60, 30),
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 36,
            color: "#ff6b6b",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            margin: 0,
            textShadow: "0 0 20px rgba(255,100,100,0.5)",
          }}
        >
          Anxious. Broken. Wounded.
        </p>
        <p
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.5)",
            fontFamily: "Georgia, serif",
            margin: "8px 0 0",
            fontStyle: "italic",
          }}
        >
          on repeat.
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3 · GOD SPEAKS ─────────────────────────────── */
const SceneGodSpeaks: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const localFrame = frame - SCENE.godSpeaks.start;
  const opacity = crossFade(frame, SCENE.godSpeaks.start, SCENE.godSpeaks.end);

  const divineReveal = interpolate(localFrame, [0, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const goldGlow = interpolate(
    Math.sin(localFrame * 0.07),
    [-1, 1],
    [0.7, 1]
  );

  const letItGoSpring = spring({
    frame: localFrame - 70,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: `linear-gradient(180deg, #1a0a00 0%, #0d0500 100%)`,
      }}
    >
      {/* Divine image */}
      <AbsoluteFill>
        <img
          src="divine.jpg"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: divineReveal * 0.75,
          }}
          alt="Divine light"
        />
      </AbsoluteFill>

      {/* Gold overlay gradient */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.85) 100%)`,
        }}
      />

      {/* Radiant pulse */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,215,0,0.25), transparent 70%)",
          opacity: goldGlow * divineReveal,
        }}
      />

      {/* Text overlay */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 160,
          padding: "0 60px 160px",
        }}
      >
        <div
          style={{
            opacity: fadeIn(localFrame, 20, 30),
            transform: `translateY(${interpolate(
              fadeIn(localFrame, 20, 30),
              [0, 1],
              [30, 0]
            )}px)`,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 38,
              color: "rgba(255,235,180,0.9)",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              margin: 0,
            }}
          >
            One night in prayer, He said…
          </p>
        </div>

        {/* "LET IT GO" */}
        <div
          style={{
            transform: `scale(${letItGoSpring})`,
            opacity: letItGoSpring,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 110,
              fontWeight: 900,
              color: "#FFD700",
              fontFamily: "Georgia, serif",
              margin: 0,
              lineHeight: 1,
              textShadow:
                "0 0 60px rgba(255,215,0,0.9), 0 0 120px rgba(255,165,0,0.6)",
              letterSpacing: -2,
            }}
          >
            "Let it go."
          </p>
        </div>
      </AbsoluteFill>

      <GoldParticles frame={localFrame} count={25} />
    </AbsoluteFill>
  );
};

/* ─── Scene 4 · DELETE ─────────────────────────────────── */
const SceneDelete: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const localFrame = frame - SCENE.delete.start;
  const opacity = crossFade(frame, SCENE.delete.start, SCENE.delete.end);

  const phoneShake = interpolate(
    Math.sin(localFrame * 0.5),
    [-1, 1],
    [-4, 4]
  ) * interpolate(localFrame, [0, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: "linear-gradient(180deg, #0d1b2a 0%, #050810 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 40px",
      }}
    >
      {/* Caption */}
      <div style={{ marginBottom: 20, opacity: fadeIn(localFrame, 0, 20) }}>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 34, fontFamily: "Georgia, serif", margin: 0, textAlign: "center", fontStyle: "italic" }}>
          So I deleted everything.
        </p>
      </div>

      {/* Playlist with strike-through songs */}
      <div
        style={{
          transform: `translateX(${phoneShake}px) scale(0.75)`,
          position: "relative",
          width: 320,
          borderRadius: 40,
          overflow: "hidden",
          boxShadow: "0 20px 80px rgba(0,0,0,0.8)",
          border: "3px solid rgba(255,100,100,0.3)",
        }}
      >
        <img
          src="playlist.jpg"
          style={{ width: "100%", display: "block" }}
          alt="Playlist being deleted"
        />

        {/* Song deletion overlays */}
        {SONGS.map((_, i) => {
          const deleteStart = 20 + i * 18;
          const lineOpacity = interpolate(
            localFrame,
            [deleteStart, deleteStart + 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const songFade = 1 - interpolate(
            localFrame,
            [deleteStart + 5, deleteStart + 20],
            [0, 0.7],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const topOffset = 22 + i * 11.5;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${topOffset}%`,
                left: "5%",
                right: "5%",
                opacity: lineOpacity,
              }}
            >
              {/* Strike-through line */}
              <div
                style={{
                  height: 2,
                  background: "rgba(255,80,80,0.9)",
                  boxShadow: "0 0 8px rgba(255,80,80,0.8)",
                  width: `${lineOpacity * 90}%`,
                }}
              />
              {/* Fade overlay */}
              <div
                style={{
                  position: "absolute",
                  top: -18,
                  left: 0,
                  right: 0,
                  height: 36,
                  background: `rgba(0,0,0,${1 - songFade})`,
                  borderRadius: 4,
                }}
              />
            </div>
          );
        })}

        {/* Final delete flash */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,80,80,0.15)",
            opacity: interpolate(
              localFrame,
              [140, 160, 175],
              [0, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        />
      </div>

      {/* "Gone." text */}
      <div
        style={{
          marginTop: 30,
          opacity: interpolate(localFrame, [150, 175], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          transform: `scale(${spring({ frame: localFrame - 155, fps, config: { damping: 14 } })})`,
        }}
      >
        <p style={{ color: "#ff6b6b", fontSize: 60, fontWeight: 900, fontFamily: "Georgia, serif", margin: 0, textShadow: "0 0 30px rgba(255,100,100,0.6)" }}>
          Gone.
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 5 · SILENCE ────────────────────────────────── */
const SceneSilence: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const localFrame = frame - SCENE.silence.start;
  const opacity = crossFade(frame, SCENE.silence.start, SCENE.silence.end);

  const breathe = interpolate(Math.sin(localFrame * 0.04), [-1, 1], [0.97, 1.03]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: "radial-gradient(ellipse at 50% 50%, #0a0a14, #000000)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          transform: `scale(${breathe})`,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 72,
            fontFamily: "Georgia, serif",
            color: "rgba(255,255,255,0.9)",
            fontStyle: "italic",
            margin: 0,
            lineHeight: 1.3,
            opacity: fadeIn(localFrame, 10, 30),
            textShadow: "0 0 40px rgba(200,220,255,0.3)",
          }}
        >
          At first it was quiet…
        </p>
      </div>

      <div
        style={{
          marginTop: 40,
          opacity: fadeIn(localFrame, 60, 30),
          transform: `translateY(${interpolate(fadeIn(localFrame, 60, 30), [0, 1], [20, 0])}px)`,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 80,
            fontFamily: "Georgia, serif",
            color: "#7eb8ff",
            fontStyle: "italic",
            fontWeight: 700,
            margin: 0,
            letterSpacing: 2,
          }}
        >
          …too quiet.
        </p>
      </div>

      {/* Heartbeat line */}
      <div
        style={{
          marginTop: 80,
          width: "80%",
          height: 2,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 1,
          opacity: fadeIn(localFrame, 100, 30),
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${interpolate(localFrame, [0, 180], [0, 100], { extrapolateRight: "clamp" })}%`,
            background: "linear-gradient(90deg, transparent, rgba(126,184,255,0.4))",
          }}
        />
      </div>

      <div
        style={{
          marginTop: 60,
          opacity: fadeIn(localFrame, 120, 30),
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 32, color: "rgba(255,255,255,0.4)", fontFamily: "Georgia, serif", fontStyle: "italic", margin: 0 }}>
          But then something shifted.
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 6 · PEACE ──────────────────────────────────── */
const ScenePeace: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const localFrame = frame - SCENE.peace.start;
  const opacity = crossFade(frame, SCENE.peace.start, SCENE.peace.end);

  const lightReveal = interpolate(localFrame, [0, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const peaceScale = spring({ frame: localFrame - 30, fps, config: { damping: 12 } });
  const hearingScale = spring({ frame: localFrame - 90, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: `linear-gradient(180deg,
          rgba(${Math.round(255 * lightReveal)},${Math.round(200 * lightReveal)},${Math.round(50 * lightReveal)},1) 0%,
          rgba(${Math.round(180 * lightReveal)},${Math.round(80 * lightReveal)},0,1) 40%,
          #0d0500 100%
        )`,
        overflow: "hidden",
      }}
    >
      {/* Divine image fade in */}
      <AbsoluteFill>
        <img
          src="divine.jpg"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: lightReveal * 0.55,
            transform: `scale(${1 + (1 - lightReveal) * 0.1})`,
          }}
          alt="Divine peace"
        />
      </AbsoluteFill>

      {/* Dark gradient overlay */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Gold ray burst */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,215,0,0.35), transparent 65%)",
          opacity: lightReveal,
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 160,
          padding: "0 60px 160px",
        }}
      >
        <div
          style={{
            transform: `scale(${peaceScale})`,
            opacity: peaceScale,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          <p
            style={{
              fontSize: 90,
              fontWeight: 900,
              color: "#FFD700",
              fontFamily: "Georgia, serif",
              margin: 0,
              lineHeight: 1,
              textShadow: "0 0 60px rgba(255,215,0,0.9), 0 0 120px rgba(255,165,0,0.5)",
            }}
          >
            Peace
          </p>
          <p
            style={{
              fontSize: 42,
              color: "rgba(255,235,180,0.9)",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              margin: "8px 0 0",
            }}
          >
            flooded my heart.
          </p>
        </div>

        <div
          style={{
            transform: `translateY(${interpolate(hearingScale, [0, 1], [30, 0])}px)`,
            opacity: hearingScale,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 34,
              color: "rgba(255,255,255,0.85)",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Worship songs replaced the noise,
            <br />
            and I started hearing God's voice
            <br />
            <span style={{ color: "#FFD700", fontWeight: 700 }}>
              clearer than ever.
            </span>
          </p>
        </div>
      </AbsoluteFill>

      <GoldParticles frame={localFrame} count={35} />
    </AbsoluteFill>
  );
};

/* ─── Scene 7 · RENEWED ────────────────────────────────── */
const SceneRenewed: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const localFrame = frame - SCENE.renewed.start;
  const opacity = crossFade(frame, SCENE.renewed.start, SCENE.renewed.end);

  const line1 = spring({ frame: localFrame - 10, fps, config: { damping: 11 } });
  const line2 = spring({ frame: localFrame - 40, fps, config: { damping: 11 } });

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: "linear-gradient(180deg, #1a0d00, #000814)",
        overflow: "hidden",
      }}
    >
      <AbsoluteFill>
        <img
          src="divine.jpg"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.6,
          }}
          alt="Renewed spirit"
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Center declarations */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 60px",
        }}
      >
        <div
          style={{
            transform: `scale(${line1})`,
            opacity: line1,
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          <p
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: "#FFD700",
              fontFamily: "Georgia, serif",
              margin: 0,
              textShadow: "0 0 60px rgba(255,215,0,1), 0 0 100px rgba(255,180,0,0.7)",
              lineHeight: 1,
            }}
          >
            My mind
          </p>
          <p
            style={{
              fontSize: 70,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "Georgia, serif",
              margin: 0,
              textShadow: "0 0 40px rgba(255,255,255,0.5)",
            }}
          >
            is renewed.
          </p>
        </div>

        <div
          style={{
            transform: `scale(${line2})`,
            opacity: line2,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: "#7eb8ff",
              fontFamily: "Georgia, serif",
              margin: 0,
              textShadow: "0 0 60px rgba(126,184,255,0.9)",
              lineHeight: 1,
            }}
          >
            My spirit
          </p>
          <p
            style={{
              fontSize: 70,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "Georgia, serif",
              margin: 0,
              textShadow: "0 0 40px rgba(255,255,255,0.5)",
            }}
          >
            is free.
          </p>
        </div>
      </AbsoluteFill>

      <GoldParticles frame={localFrame} count={40} />
    </AbsoluteFill>
  );
};

/* ─── Scene 8 · CTA ────────────────────────────────────── */
const SceneCTA: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const localFrame = frame - SCENE.cta.start;
  const opacity = fadeIn(frame, SCENE.cta.start, 25);

  const heartBeat = interpolate(
    Math.sin(localFrame * 0.25),
    [-1, 1],
    [0.9, 1.15]
  );

  const line1 = spring({ frame: localFrame - 5, fps, config: { damping: 13 } });
  const line2 = spring({ frame: localFrame - 30, fps, config: { damping: 13 } });
  const line3 = spring({ frame: localFrame - 60, fps, config: { damping: 13 } });
  const line4 = spring({ frame: localFrame - 90, fps, config: { damping: 13 } });

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: "linear-gradient(180deg, #0d0500 0%, #000814 50%, #0a1a0d 100%)",
        overflow: "hidden",
      }}
    >
      {/* Background divine glow */}
      <AbsoluteFill>
        <img
          src="divine.jpg"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.3,
          }}
          alt="Background"
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 60px",
          gap: 20,
        }}
      >
        {/* Obey Him line */}
        <div
          style={{
            opacity: line1,
            transform: `translateY(${interpolate(line1, [0, 1], [30, 0])}px)`,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 38,
              color: "rgba(255,235,180,0.9)",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            If God is speaking to you about
            <br />
            something you need to delete —
          </p>
        </div>

        <div
          style={{
            opacity: line2,
            transform: `scale(${line2})`,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 90,
              fontWeight: 900,
              color: "#FFD700",
              fontFamily: "Georgia, serif",
              margin: 0,
              textShadow: "0 0 60px rgba(255,215,0,0.9)",
              lineHeight: 1,
            }}
          >
            Obey Him.
          </p>
          <p
            style={{
              fontSize: 34,
              color: "rgba(255,255,255,0.7)",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              margin: "8px 0 0",
            }}
          >
            The blessing is on the other side.
          </p>
        </div>

        {/* You're going to make it */}
        <div
          style={{
            opacity: line3,
            transform: `scale(${line3})`,
            textAlign: "center",
            marginTop: 10,
          }}
        >
          <p
            style={{
              fontSize: 60,
              fontWeight: 900,
              color: "#ffffff",
              fontFamily: "Georgia, serif",
              margin: 0,
              textShadow: "0 0 40px rgba(255,255,255,0.5)",
              lineHeight: 1.2,
            }}
          >
            You're going to
            <br />
            <span style={{ color: "#7eb8ff" }}>make it.</span>
          </p>
        </div>

        {/* Heart CTA */}
        <div
          style={{
            opacity: line4,
            textAlign: "center",
            marginTop: 10,
          }}
        >
          <p
            style={{
              fontSize: 38,
              color: "rgba(255,255,255,0.7)",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              margin: "0 0 8px",
            }}
          >
            Drop a
          </p>
          <div
            style={{
              fontSize: 100,
              transform: `scale(${heartBeat})`,
              display: "inline-block",
              filter: "drop-shadow(0 0 20px rgba(255,80,100,0.8))",
            }}
          >
            ❤️
          </div>
          <p
            style={{
              fontSize: 32,
              color: "rgba(255,255,255,0.6)",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              margin: "8px 0 0",
            }}
          >
            if this encouraged you!
          </p>
        </div>
      </AbsoluteFill>

      <GoldParticles frame={localFrame} count={30} />
    </AbsoluteFill>
  );
};

/* ─── Main Composition ─────────────────────────────────── */
export const PlaylistDeletion: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: "#000000", fontFamily: "Georgia, serif" }}>
      {frame < SCENE.playlist.start && <SceneHook frame={frame} />}
      {frame >= SCENE.playlist.start && frame < SCENE.godSpeaks.start && (
        <ScenePlaylist frame={frame} />
      )}
      {frame >= SCENE.godSpeaks.start && frame < SCENE.delete.start && (
        <SceneGodSpeaks frame={frame} />
      )}
      {frame >= SCENE.delete.start && frame < SCENE.silence.start && (
        <SceneDelete frame={frame} />
      )}
      {frame >= SCENE.silence.start && frame < SCENE.peace.start && (
        <SceneSilence frame={frame} />
      )}
      {frame >= SCENE.peace.start && frame < SCENE.renewed.start && (
        <ScenePeace frame={frame} />
      )}
      {frame >= SCENE.renewed.start && frame < SCENE.cta.start && (
        <SceneRenewed frame={frame} />
      )}
      {frame >= SCENE.cta.start && <SceneCTA frame={frame} />}
    </AbsoluteFill>
  );
};
