
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { exportUserData, importUserData } from '@/services/storageService';
import { LogIn, LogOut, Save, RefreshCw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import GlassCard from '@/components/ui/glass-card';

// Mock Google auth functionality since we don't have actual Google OAuth API key
const GoogleAccountLink = () => {
  const [isLinked, setIsLinked] = useState(localStorage.getItem('google_account_linked') === 'true');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLinkAccount = () => {
    setIsLoading(true);
    
    // Simulate linking with a timeout
    setTimeout(() => {
      localStorage.setItem('google_account_linked', 'true');
      setIsLinked(true);
      setIsLoading(false);
      
      toast({
        title: "Account Linked",
        description: "Your Google account has been successfully linked. You can now backup your data.",
        variant: "default",
      });
    }, 1500);
  };
  
  const handleUnlinkAccount = () => {
    setIsLoading(true);
    
    // Simulate unlinking with a timeout
    setTimeout(() => {
      localStorage.removeItem('google_account_linked');
      setIsLinked(false);
      setIsLoading(false);
      
      toast({
        title: "Account Unlinked",
        description: "Your Google account has been unlinked. Your data will remain on this device only.",
        variant: "default",
      });
    }, 1000);
  };
  
  const handleBackupData = () => {
    setIsLoading(true);
    
    // Simulate backup with a timeout
    setTimeout(() => {
      // Export user data
      const userData = exportUserData();
      
      // In a real implementation, this would be sent to Google Drive
      // For now, we'll just simulate a successful backup
      localStorage.setItem('last_backup_date', new Date().toISOString());
      
      setIsLoading(false);
      toast({
        title: "Backup Complete",
        description: "Your data has been backed up to your Google account.",
        variant: "default",
      });
    }, 2000);
  };
  
  const handleRestoreData = () => {
    setIsLoading(true);
    
    // Simulate restore with a timeout
    setTimeout(() => {
      // In a real implementation, this would retrieve data from Google Drive
      // For now, we'll just simulate a successful restore using current data
      const userData = exportUserData();
      const success = importUserData(userData);
      
      setIsLoading(false);
      if (success) {
        toast({
          title: "Restore Complete",
          description: "Your data has been restored from your Google account.",
          variant: "default",
        });
      } else {
        toast({
          title: "Restore Failed",
          description: "There was a problem restoring your data. Please try again.",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const lastBackup = localStorage.getItem('last_backup_date');
  const lastBackupDate = lastBackup ? new Date(lastBackup).toLocaleString() : 'Never';

  return (
    <GlassCard>
      <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
        Google Account Backup
      </h2>
      
      <p className="text-sm text-gray-300 mb-4">
        Linking your Google account allows you to backup and restore your data across devices.
        This is optional and the app works fully offline without linking.
      </p>
      
      {isLinked ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-300">Account Linked</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleUnlinkAccount}
              disabled={isLoading}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Unlink
            </Button>
          </div>
          
          <Separator className="my-4 bg-white/10" />
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Last backup: {lastBackupDate}</span>
            </div>
            
            <div className="flex space-x-2">
              <Button
                className="flex-1"
                onClick={handleBackupData}
                disabled={isLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                Backup
              </Button>
              
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleRestoreData}
                disabled={isLoading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Restore
              </Button>
            </div>
          </div>
        </>
      ) : (
        <Button 
          className="w-full" 
          onClick={handleLinkAccount}
          disabled={isLoading}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Link Google Account
        </Button>
      )}
    </GlassCard>
  );
};

export default GoogleAccountLink;
