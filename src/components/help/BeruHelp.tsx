
import React, { useState } from 'react';
import BeruHelpIcon from './BeruHelpIcon';
import BeruHelpDialog from './BeruHelpDialog';

const BeruHelp: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  
  return (
    <>
      <BeruHelpIcon onClick={handleOpenDialog} />
      <BeruHelpDialog open={isDialogOpen} onClose={handleCloseDialog} />
    </>
  );
};

export default BeruHelp;
