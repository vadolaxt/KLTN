'use client';

import MajorScoreSupportView from './components/score-support/MajorScoreSupportView';
import MethodScoreSupportView from './components/score-support/MethodScoreSupportView';
import type { ScoreSupportMode } from './components/score-support/types';

interface ScoreSupportViewProps {
  mode: ScoreSupportMode;
}

export default function ScoreSupportView({ mode }: ScoreSupportViewProps) {
  return (
    <div className="animate-fade-in">
      {mode === 'method' ? <MethodScoreSupportView /> : <MajorScoreSupportView />}
    </div>
  );
}
