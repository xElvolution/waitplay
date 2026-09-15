"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Target = {
  id: number;
  x: number;
  y: number;
  points: number;
};

export function MicroGame({
  active,
  onScore,
}: {
  active: boolean;
  onScore: (score: number) => void;
}) {
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState<Target[]>([]);
  const [combo, setCombo] = useState(0);
  const nextId = useRef(1);
  const scoreRef = useRef(0);

  useEffect(() => {
    scoreRef.current = score;
    onScore(score);
  }, [score, onScore]);

  useEffect(() => {
    if (!active) return;
    const spawn = () => {
      setTargets((prev) => {
        const next = prev.slice(-4);
        next.push({
          id: nextId.current++,
          x: 8 + Math.random() * 76,
          y: 12 + Math.random() * 66,
          points: 8 + Math.floor(Math.random() * 12),
        });
        return next;
      });
    };
    spawn();
    const interval = window.setInterval(spawn, 700);
    return () => window.clearInterval(interval);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const prune = window.setInterval(() => {
      setTargets((prev) => prev.slice(1));
      setCombo(0);
    }, 1800);
    return () => window.clearInterval(prune);
  }, [active]);

  const hit = useCallback((target: Target) => {
    setTargets((prev) => prev.filter((t) => t.id !== target.id));
    setCombo((c) => {
      const nextCombo = c + 1;
      const bonus = Math.min(20, nextCombo * 2);
      setScore((s) => s + target.points + bonus);
      return nextCombo;
    });
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-white">Pulse Tap</h3>
          <p className="text-sm text-zinc-400">
            Hit glowing orbs before they fade. Combos boost XP.
          </p>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl font-semibold text-violet-300">
            {score}
          </div>
          <div className="text-xs text-zinc-500">combo x{combo}</div>
        </div>
      </div>
      <div className="relative h-64 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.18),transparent_55%),#0b0b14]">
        <AnimatePresence>
          {targets.map((target) => (
            <motion.button
              key={target.id}
              type="button"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              onClick={() => hit(target)}
              className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-300 shadow-[0_0_24px_rgba(217,70,239,0.55)]"
              style={{ left: `${target.x}%`, top: `${target.y}%` }}
              aria-label={`Hit target for ${target.points} points`}
            />
          ))}
        </AnimatePresence>
        {!active && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm text-zinc-300">
            Waiting for the next run
          </div>
        )}
      </div>
    </div>
  );
}
