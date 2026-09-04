/**
 * Replaced cloud Google link with fully local backup controls.
 * Kept under the same path so Profile imports continue to work if referenced.
 */
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, RotateCcw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import GlassCard from '@/components/ui/glass-card';
import { useApp } from '@/context/AppContext';

const GoogleAccountLink = () => {
  const { exportBackup, importBackup, resetAll } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const lastBackup = localStorage.getItem('last_backup_date');
  const lastBackupDate = lastBackup ? new Date(lastBackup).toLocaleString() : 'Never';

  return (
    <GlassCard>
      <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
        Local Data Backup
      </h2>

      <p className="text-sm text-gray-300 mb-4">
        Task Soloist is fully self-reliant. Export a JSON backup of your SQLite-backed progress,
        or restore from a previous export. No internet or cloud account required.
      </p>

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-300">Last export: {lastBackupDate}</span>
      </div>

      <Separator className="my-4 bg-white/10" />

      <div className="flex space-x-2">
        <Button className="flex-1" onClick={() => exportBackup()}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>

        <Button
          variant="outline"
          className="flex-1"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) await importBackup(file);
            e.target.value = '';
          }}
        />
      </div>

      <Button
        variant="ghost"
        className="w-full mt-3 text-red-400 hover:text-red-300"
        onClick={async () => {
          if (window.confirm('Reset all data?')) {
            await resetAll();
            window.location.href = '/';
          }
        }}
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset data
      </Button>
    </GlassCard>
  );
};

export default GoogleAccountLink;
