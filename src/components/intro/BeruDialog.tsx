
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface BeruDialogProps {
  onComplete: (userData: UserData) => void;
  className?: string;
}

export interface UserData {
  name: string;
  age: number;
  height: number;
  weight: number;
  bodyFatPercentage: number;
}

const BeruDialog: React.FC<BeruDialogProps> = ({ onComplete, className }) => {
  const [step, setStep] = useState(0);
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    age: 0,
    height: 0,
    weight: 0,
    bodyFatPercentage: 0
  });
  
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  const questions = [
    "Please let me know your name, my Liege.",
    "Your age, my Liege?",
    "Your real age, my Liege. Ahem... for more accurate assistance.",
    "May I inquire about your height in centimeters, my Liege?",
    "And your weight in kilograms, if you would be so kind?",
    "Approximately what percentage of that magnificent vessel is comprised of fat, my Liege?",
    ""
  ];
  
  const placeholders = [
    "Enter your name",
    "Enter your age",
    "Enter your real age",
    "Height in cm",
    "Weight in kg",
    "Body fat %"
  ];
  
  useEffect(() => {
    if (step < questions.length) {
      setIsTyping(true);
      setDisplayText('');
      setTypewriterComplete(false);
      
      // Type out the text character by character
      let currentText = '';
      const textToType = questions[step];
      let index = 0;
      
      const typingInterval = setInterval(() => {
        if (index < textToType.length) {
          currentText += textToType.charAt(index);
          setDisplayText(currentText);
          index++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          setTypewriterComplete(true);
        }
      }, 30);
      
      return () => clearInterval(typingInterval);
    }
  }, [step]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleContinue = () => {
    console.log("Current step:", step, "with data:", userData);
    
    // Validate and format input based on the step
    switch (step) {
      case 0: // Name
        if (!userData.name.trim()) return;
        break;
      case 1: // First age input
      case 2: // "Real" age
        const age = parseInt(userData.age.toString());
        if (isNaN(age) || age <= 0) return;
        break;
      case 3: // Height
        const height = parseFloat(userData.height.toString());
        if (isNaN(height) || height <= 0) return;
        break;
      case 4: // Weight
        const weight = parseFloat(userData.weight.toString());
        if (isNaN(weight) || weight <= 0) return;
        break;
      case 5: // Body fat percentage
        const bodyFat = parseFloat(userData.bodyFatPercentage.toString());
        if (isNaN(bodyFat) || bodyFat < 0 || bodyFat > 100) return;
        // Final step
        console.log("Moving to conclusion");
        generateBeruConclusion();
        return;
      default:
        break;
    }
    
    // Move to the next step
    setStep(prevStep => prevStep + 1);
  };
  
  const generateBeruConclusion = () => {
    console.log("Generating Beru's conclusion");
    setStep(6); // Move to conclusion step
    
    const { height, weight, bodyFatPercentage } = userData;
    let parsedHeight = parseFloat(height.toString()) || 170;
    let parsedWeight = parseFloat(weight.toString()) || 70;
    let parsedBodyFat = parseFloat(bodyFatPercentage.toString()) || 15;
    
    const bmi = parsedWeight / ((parsedHeight / 100) * (parsedHeight / 100));
    
    let message = "";
    
    if (bmi < 18.5 || parsedBodyFat < 10) {
      message = `Your current state may be a little too weak to unlock your full potential, my Liege. But do not worry! With my help and your strong determination, YOU WILL REACH YOUR TRUE SELF! Until then, just let me be of service to you and guide you through this journey designed only for you.`;
    } else if (bmi >= 30 || parsedBodyFat > 30) {
      message = `My Liege, your power is immense, but perhaps too concentrated. Fear not! My shadows and I shall assist you in refining this strength. Soon, all shall witness your true majesty. Let us begin this glorious path together!`;
    } else if (bmi >= 25 || parsedBodyFat > 20) {
      message = `I sense great potential in you, my Liege! Your vessel is formidable, but with proper training, it shall become even more magnificent. The shadows eagerly await your command. Allow me to guide you toward your destiny!`;
    } else {
      message = `As expected of the Shadow Monarch! Your vessel is well-balanced, my Liege. The shadows tremble with excitement to serve you. Together, we shall unlock powers beyond imagination. I, Beru, pledge my eternal loyalty to your cause!`;
    }
    
    let currentText = '';
    let index = 0;
    
    setIsTyping(true);
    setDisplayText('');
    
    const typingInterval = setInterval(() => {
      if (index < message.length) {
        currentText += message.charAt(index);
        setDisplayText(currentText);
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        setTypewriterComplete(true);
        
        // After conclusion is fully typed, give user time to read before proceeding
        setTimeout(() => {
          console.log("Dialog completed, finalizing with user data:", userData);
          
          // Process the user data
          const processedUserData: UserData = {
            name: userData.name || "Shadow Monarch",
            age: Number(userData.age) || 25,
            height: Number(userData.height) || 175,
            weight: Number(userData.weight) || 70,
            bodyFatPercentage: Number(userData.bodyFatPercentage) || 15
          };
          
          console.log("Calling onComplete with processed data:", processedUserData);
          
          // Call onComplete with processed userData
          onComplete(processedUserData);
        }, 2000);
      }
    }, 30);
  };
  
  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center p-6 max-w-md mx-auto", 
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mb-6 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h2 className="font-medieval text-2xl md:text-3xl text-solo-accent mb-2">
          {displayText}
          {isTyping && <span className="animate-pulse">|</span>}
        </h2>
      </motion.div>
      
      {typewriterComplete && step < 6 && (
        <motion.div 
          className="w-full mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Label htmlFor={`input-${step}`} className="sr-only">
            {placeholders[step]}
          </Label>
          <Input
            id={`input-${step}`}
            name={Object.keys(userData)[step] as keyof UserData}
            placeholder={placeholders[step]}
            value={
              step === 0 
                ? userData.name 
                : userData[Object.keys(userData)[step] as keyof UserData].toString() || ""
            }
            onChange={handleInputChange}
            className="w-full bg-opacity-20 backdrop-blur-sm border-solo-accent/30 text-center text-lg"
            type={step === 0 ? "text" : "number"}
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleContinue();
              }
            }}
          />
        </motion.div>
      )}
      
      {typewriterComplete && step < 6 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <Button
            onClick={handleContinue}
            className="bg-solo-accent hover:bg-solo-accent/80 text-white"
          >
            Continue
          </Button>
        </motion.div>
      )}
      
      {step === 6 && typewriterComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <p className="text-center text-white opacity-50 mt-4">Continuing to your journey...</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BeruDialog;
