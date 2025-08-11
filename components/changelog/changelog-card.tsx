"use client"

import { useState } from 'react';
import { Check, Link2 } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import type { ChangelogEntry } from '@/lib/changelog';
import HoverLink from '@/components/shared/buttons/hover-link';
import { Button } from '@/components/ui/button';
import Separator from '@/components/shared/common/separator';

import { copyToClipboard } from '@/lib/copy';

interface ChangelogEntryProps {
  entry: ChangelogEntry;
  hasDetails?: boolean;
}

export default function ChangelogCard(
  { entry, hasDetails = true }: ChangelogEntryProps
) {
  const { toast } = useToast()
  const [copying, setCopying] = useState(false)

  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const renderArticleHeader = () => {
    return (
      <header className="flex items-center justify-between font-sans">
        <div className="flex flex-col space-y-2">
          <h1 className="text-xl font-semibold">{entry.title}</h1>
          <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
            <p>{entry.type}</p>
            <p className="block sm:hidden">|</p>
            <time className="block sm:hidden">{formattedDate}</time>
          </div>
        </div>
        <time className="text-xl text-right hidden sm:block">{formattedDate}</time>
      </header>
    )
  }

  const renderExcerpt = () => {
    return (
      <p className="font-serif text-gray-600 dark:text-gray-400">{entry.excerpt}</p>
    )
  }

  const handleCopy = () => {
    copyToClipboard(
      `${window.location.origin}/changelog/${entry.date}`, {
      onCopyStart: () => setCopying(true),
      onCopyComplete: () => setCopying(false),
      toastMessage: "Article URL copied to clipboard!",
      toast,
    })
  }

  const renderLinks = () => {
    if (!hasDetails) {
      return null;
    }

    return (
      <div className="flex justify-between">
        <Button size="icon" variant="dashed" onClick={handleCopy} disabled={copying}>
          {copying ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
        </Button>
        <HoverLink
          title="Read more"
          href={`/changelog/${entry.date}`}
        />
      </div>
    )
  }

  return (
    <article className="space-y-4">
      {renderArticleHeader()}
      {renderExcerpt()}
      {renderLinks()}
      <div className="pt-4"><Separator /></div>
    </article>
  );
} 