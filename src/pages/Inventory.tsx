import React from 'react';
import NavBar from '@/components/navigation/nav-bar';
import GlassCard from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { Package, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const rarityColor: Record<string, string> = {
  common: 'border-white/20 text-gray-300',
  uncommon: 'border-green-500/40 text-green-300',
  rare: 'border-blue-500/40 text-blue-300',
  epic: 'border-purple-500/40 text-purple-300',
  legendary: 'border-amber-500/40 text-amber-300',
};

const Inventory = () => {
  const { state, useItem } = useApp();
  const items = state?.inventory || [];
  const currency = state?.user?.currency ?? 0;

  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
              Inventory
            </h1>
            <p className="text-sm text-solo-secondary mt-1">Items earned from conquests</p>
          </div>
          <div className="bg-black/30 rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>{currency} coins</span>
          </div>
        </div>

        <div className="space-y-3 animate-scale-in">
          {items.length === 0 && (
            <GlassCard className="text-center py-10">
              <Package className="h-8 w-8 mx-auto mb-2 text-solo-secondary" />
              <p className="text-solo-secondary">Inventory empty.</p>
              <p className="text-xs text-solo-secondary/70 mt-1">
                Complete achievements and quests for a chance at loot.
              </p>
            </GlassCard>
          )}
          {items.map((item) => (
            <GlassCard
              key={item.id}
              className={cn('border', rarityColor[item.rarity] || rarityColor.common)}
            >
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-lg bg-black/30 flex items-center justify-center shrink-0">
                  <Package className="h-6 w-6 text-solo-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium text-lg">{item.name}</h3>
                    <span className="text-xs uppercase tracking-wide opacity-80">
                      ×{item.quantity}
                    </span>
                  </div>
                  <p className="text-sm text-solo-secondary mt-0.5">{item.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs py-1 px-2 rounded-full bg-black/30 capitalize">
                      {item.rarity} · {item.type}
                    </span>
                    {item.type === 'consumable' && (
                      <Button
                        size="sm"
                        className="bg-solo-accent hover:bg-solo-accent/80"
                        onClick={() => useItem(item.id)}
                      >
                        Use
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
      <NavBar />
    </div>
  );
};

export default Inventory;
