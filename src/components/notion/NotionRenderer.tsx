'use client';

import React from 'react';
import type { NotionRenderBlock } from '@/services/notion';
import { Block } from './blocks/Block';

interface NotionRendererProps {
  blocks: NotionRenderBlock[];
  className?: string;
}

export const NotionRenderer: React.FC<NotionRendererProps> = ({ 
  blocks, 
  className = '' 
}) => {
  return (
    <div className={`notion-renderer ${className}`}>
      {blocks.map((block, index) => (
        <Block key={`block-${block.key || index}`} block={block} />
      ))}
    </div>
  );
};

export default NotionRenderer;