import React, { useState } from 'react';
import NavBar from '@/components/navigation/nav-bar';
import GlassCard from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/context/AppContext';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOODS = [
  { value: 1, label: '🌑', name: 'Low' },
  { value: 2, label: '🌘', name: 'Dim' },
  { value: 3, label: '🌓', name: 'Steady' },
  { value: 4, label: '🌔', name: 'Bright' },
  { value: 5, label: '🌕', name: 'Radiant' },
];

const Journal = () => {
  const { state, createJournal, deleteJournal } = useApp();
  const entries = state?.journal || [];
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(3);
  const [showForm, setShowForm] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;
    await createJournal({ title: title.trim(), content: content.trim(), mood });
    setTitle('');
    setContent('');
    setMood(3);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
              Journal
            </h1>
            <p className="text-sm text-solo-secondary mt-1">Reflect and grow · +3 XP per entry</p>
          </div>
          <Button
            size="sm"
            className="bg-solo-accent hover:bg-solo-accent/80"
            onClick={() => setShowForm((v) => !v)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Write
          </Button>
        </div>

        {showForm && (
          <GlassCard className="mb-6 animate-scale-in space-y-3">
            <Input
              placeholder="Title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-black/20 border-white/10"
            />
            <Textarea
              placeholder="What did the shadows teach you today?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-black/20 border-white/10 min-h-[120px]"
            />
            <div>
              <p className="text-xs text-solo-secondary mb-2">Mood</p>
              <div className="flex gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMood(m.value)}
                    className={cn(
                      'flex-1 py-2 rounded-lg border text-lg transition-all',
                      mood === m.value
                        ? 'border-solo-accent bg-solo-accent/20'
                        : 'border-white/10 hover:border-white/20'
                    )}
                    title={m.name}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button className="bg-solo-accent" onClick={handleSave} disabled={!content.trim()}>
                Save Entry
              </Button>
            </div>
          </GlassCard>
        )}

        <div className="space-y-3 animate-scale-in">
          {entries.length === 0 && (
            <GlassCard className="text-center py-10">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-solo-secondary" />
              <p className="text-solo-secondary">No entries yet. Begin your chronicle.</p>
            </GlassCard>
          )}
          {entries.map((entry) => {
            const moodMeta = MOODS.find((m) => m.value === entry.mood) || MOODS[2];
            return (
              <GlassCard key={entry.id}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{moodMeta.label}</span>
                      <h3 className="font-medium">
                        {entry.title || 'Untitled entry'}
                      </h3>
                    </div>
                    <p className="text-sm text-solo-secondary whitespace-pre-wrap">
                      {entry.content}
                    </p>
                    <p className="text-xs text-solo-secondary/60 mt-2">
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    className="text-solo-secondary/50 hover:text-red-400 p-1"
                    onClick={() => deleteJournal(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
      <NavBar />
    </div>
  );
};

export default Journal;
