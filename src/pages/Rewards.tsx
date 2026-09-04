import React, { useState } from 'react';
import NavBar from '@/components/navigation/nav-bar';
import GlassCard from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';
import { Coins, Gift, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Rewards = () => {
  const { state, claimReward, createReward } = useApp();
  const rewards = state?.rewards || [];
  const currency = state?.user?.currency ?? 0;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('20');

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createReward({
      name: name.trim(),
      description: description.trim(),
      cost: Number(cost) || 10,
      icon: 'gift',
    });
    setName('');
    setDescription('');
    setCost('20');
    setOpen(false);
  };

  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
              Rewards
            </h1>
            <p className="text-sm text-solo-secondary mt-1">Spend shadow coins wisely</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-black/30 rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5">
              <Coins className="h-4 w-4 text-amber-400" />
              {currency}
            </div>
            <Button size="sm" className="bg-solo-accent" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3 animate-scale-in">
          {rewards.map((reward) => {
            const canAfford = currency >= reward.cost;
            return (
              <GlassCard key={reward.id}>
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Gift className="h-6 w-6 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{reward.name}</h3>
                    <p className="text-sm text-solo-secondary">{reward.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs py-1 px-2 rounded-full bg-amber-500/20 text-amber-300 flex items-center gap-1">
                        <Coins className="h-3 w-3" />
                        {reward.cost}
                        {reward.timesClaimed ? ` · claimed ${reward.timesClaimed}×` : ''}
                      </span>
                      <Button
                        size="sm"
                        disabled={!canAfford}
                        className="bg-solo-accent hover:bg-solo-accent/80 disabled:opacity-40"
                        onClick={() => claimReward(reward.id)}
                      >
                        Claim
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-solo-card border-white/10 text-solo-text">
          <DialogHeader>
            <DialogTitle>Custom Reward</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Reward name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black/20 border-white/10"
            />
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-black/20 border-white/10"
            />
            <Input
              type="number"
              placeholder="Cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="bg-black/20 border-white/10"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-solo-accent" onClick={handleCreate}>
              Add Reward
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NavBar />
    </div>
  );
};

export default Rewards;
