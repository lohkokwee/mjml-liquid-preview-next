"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect } from "react";

import { MDXRemoteSerializeResult } from "next-mdx-remote";
import MDXContent from "@/components/changelog/mdx-content";
import { ChangelogEntry } from "@/lib/changelog";
import Separator from "@/components/shared/common/separator";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/copy";

interface ChangelogPostProps {
  entry: ChangelogEntry;
}

export default function ChangelogPost({ entry }: ChangelogPostProps) {
  const { toast } = useToast();
  const [copying, setCopying] = useState(false);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);

  useEffect(() => {
    const parseMdx = async () => {
      try {
        if (entry.content) {
          const mdxSource = await serialize(entry.content);
          setMdxSource(mdxSource);
        }
      } catch (error) {
        console.error("Error parsing MDX:", error);
      }
    };

    parseMdx();
  }, [entry.content]);

  const date = new Date(entry.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const handleCopy = () => {
    copyToClipboard(
      `${window.location.origin}/changelog/${entry.date}`, {
      onCopyStart: () => setCopying(true),
      onCopyComplete: () => setCopying(false),
      toastMessage: "Article URL copied to clipboard!",
      toast,
    })
  }

  const renderShareButton = () => {
    return (
      <Button size="iconSm" variant="dashed" onClick={handleCopy} disabled={copying}>
        {copying ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
      </Button>
    )
  }

  const renderHeader = () => {
    return (
      <div className="mb-4 flex items-center justify-between font-sans space-x-8">
        <div className="flex flex-col space-y-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-sans">
              {entry.title}
              <span className="ml-2 hidden sm:inline">{renderShareButton()}</span>
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{entry.type}</p>
          <div className="flex sm:hidden justify-between">
            <p className="text-lg">{formattedDate}</p>
            {renderShareButton()}
          </div>
        </div>
        <p className="hidden sm:block text-3xl text-right">{formattedDate}</p>
      </div>
    )
  }

  const renderContent = () => {
    if (!mdxSource) {
      return <div className="font-serif text-gray-600 dark:text-gray-400">Loading content...</div>;
    }

    return (
      <div className="mdx-content">
        <MDXContent mdxSource={mdxSource} />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderHeader()}
      <Separator />
      {renderContent()}
    </div>
  )
}