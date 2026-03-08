import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  progress?: number; // 0..100
  title?: string;
}

export default function GoalsCard({ progress = 0, title = 'Goals' }: Props) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div className="bg-green-500 h-3" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
          </div>
          <div className="text-sm text-gray-600 mt-2">{progress}% alcançado</div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={() => navigate('/goals')} className="px-3 py-1 rounded bg-green-600 text-white text-sm">Ver metas</button>
      </div>
    </div>
  );
}
