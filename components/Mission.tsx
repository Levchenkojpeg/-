import React from 'react';
import { Editable } from './Editable';

interface MissionProps {
  isDevMode: boolean;
  missionText: string;
  onMissionChange: (value: string) => void;
}

export const Mission: React.FC<MissionProps> = ({ isDevMode, missionText, onMissionChange }) => {
  return (
    <section className="text-center py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-4">
        <Editable
          as="p"
          isEditing={isDevMode}
          onSave={onMissionChange}
          className="text-2xl md:text-3xl lg:text-4xl text-gray-200 leading-relaxed font-medium"
          dangerouslySetInnerHTML={{ __html: missionText }}
        />
      </div>
    </section>
  );
};
