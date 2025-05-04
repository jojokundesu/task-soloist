
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface BeruDialogProps {
  onComplete: (userData: UserData) => void;
  className?: string;
}

export interface UserData {
  name: string;
  age: number;
  height: number; // stored in cm internally
  weight: number;
  bodyFatPercentage: number;
  intelligenceLevel: number;
  strengthLevel: number;
}

const BeruDialog: React.FC<BeruDialogProps> = ({ onComplete, className }) => {
  const [step, setStep] = useState(0);
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    age: 25,
    height: 175,
    weight: 70,
    bodyFatPercentage: 15,
    intelligenceLevel: 5,
    strengthLevel: 5
  });
  
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [heightUnit, setHeightUnit] = useState<'feet' | 'cm'>('feet');
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(10);
  const [currentTypingInterval, setCurrentTypingInterval] = useState<NodeJS.Timeout | null>(null);
  
  const questions = [
    "Please let me know your name, my Liege.",
    "Your age, my Liege?",
    "Your real age, my Liege. Ahem... for more accurate assistance.",
    "May I inquire about your height, my Liege?",
    "And your weight in kilograms, if you would be so kind?",
    "Approximately what percentage of that magnificent vessel is comprised of fat, my Liege?",
    "On a scale of 1 to 10, how would you rate your intelligence, my Liege? With 1 being a mere mortal's comprehension, 5 being that of a learned scholar, and 10 rivaling the ancient wisdom of immortals.",
    "And lastly, my Liege, how would you gauge your physical strength? From 1 to 10, where 1 is but a fledgling warrior, 5 is a seasoned knight, and 10 is... well, yourself at full power.",
    ""
  ];
  
  const placeholders = [
    "Enter your name",
    "Enter your age",
    "Enter your real age",
    "", // Height has custom input
    "Weight in kg",
    "Body fat %",
    "Intelligence (1-10)",
    "Strength (1-10)"
  ];
  
  // Clean up any existing interval when component unmounts
  useEffect(() => {
    return () => {
      if (currentTypingInterval) {
        clearInterval(currentTypingInterval);
      }
    };
  }, [currentTypingInterval]);
  
  useEffect(() => {
    if (step < questions.length) {
      // Clear any existing typing animation
      if (currentTypingInterval) {
        clearInterval(currentTypingInterval);
      }
      
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
      
      // Save reference to current interval
      setCurrentTypingInterval(typingInterval);
      
      return () => clearInterval(typingInterval);
    }
  }, [step]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs specially to ensure they're stored as numbers
    if (name === 'age' || name === 'weight' || name === 'height' || 
        name === 'bodyFatPercentage' || name === 'intelligenceLevel' || 
        name === 'strengthLevel') {
      setUserData(prev => ({ 
        ...prev, 
        [name]: value === '' ? '' : Number(value) 
      }));
    } else {
      setUserData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const convertFeetInchesToCm = (feet: number, inches: number): number => {
    return Math.round((feet * 30.48) + (inches * 2.54));
  };
  
  const handleContinue = () => {
    console.log("Current step:", step, "with data:", userData);
    
    // Validate and format input based on the step
    switch (step) {
      case 0: // Name
        if (!userData.name.trim()) {
          console.log("Name is empty, can't proceed");
          return;
        }
        console.log("Name validation passed, advancing to step 1");
        setStep(prevStep => prevStep + 1);
        break;
        
      case 1: // First age input
      case 2: // "Real" age
        const age = Number(userData.age);
        if (isNaN(age) || age <= 0) {
          console.log("Age is invalid:", userData.age);
          return;
        }
        console.log("Age validation passed, advancing to next step");
        setStep(prevStep => prevStep + 1);
        break;
        
      case 3: // Height
        // Convert height if needed
        if (heightUnit === 'feet') {
          const heightInCm = convertFeetInchesToCm(feet, inches);
          setUserData(prev => ({ ...prev, height: heightInCm }));
          console.log("Setting height in cm:", heightInCm);
        } else {
          // Validate cm input
          if (isNaN(Number(userData.height)) || Number(userData.height) <= 0) {
            console.log("Height is invalid:", userData.height);
            return;
          }
        }
        console.log("Height validation passed, advancing to weight step");
        setStep(prevStep => prevStep + 1);
        break;
        
      case 4: // Weight
        const weight = Number(userData.weight);
        if (isNaN(weight) || weight <= 0) {
          console.log("Weight is invalid:", userData.weight);
          return;
        }
        console.log("Weight validation passed, advancing to body fat step");
        setStep(prevStep => prevStep + 1);
        break;
        
      case 5: // Body fat percentage
        const bodyFat = Number(userData.bodyFatPercentage);
        if (isNaN(bodyFat) || bodyFat < 0 || bodyFat > 100) {
          console.log("Body fat is invalid:", userData.bodyFatPercentage);
          return;
        }
        console.log("Body fat validation passed, advancing to intelligence step");
        setStep(prevStep => prevStep + 1);
        break;
        
      case 6: // Intelligence level
        const intelligence = Number(userData.intelligenceLevel);
        if (isNaN(intelligence) || intelligence < 1 || intelligence > 10) {
          console.log("Intelligence is invalid:", userData.intelligenceLevel);
          return;
        }
        console.log("Intelligence validation passed, advancing to strength step");
        setStep(prevStep => prevStep + 1);
        break;
        
      case 7: // Strength level
        const strength = Number(userData.strengthLevel);
        if (isNaN(strength) || strength < 1 || strength > 10) {
          console.log("Strength is invalid:", userData.strengthLevel);
          return;
        }
        // Final step
        console.log("Strength validation passed, moving to conclusion");
        generateBeruConclusion();
        return;
        
      default:
        break;
    }
  };
  
  const generateBeruConclusion = () => {
    console.log("Generating Beru's conclusion");
    setStep(8); // Move to conclusion step
    
    // Use the current userData values, ensuring we have valid numbers
    const validatedUserData = {
      name: userData.name || "Shadow Monarch",
      age: isNaN(Number(userData.age)) ? 25 : Number(userData.age),
      height: isNaN(Number(userData.height)) ? 175 : Number(userData.height),
      weight: isNaN(Number(userData.weight)) ? 70 : Number(userData.weight),
      bodyFatPercentage: isNaN(Number(userData.bodyFatPercentage)) ? 15 : Number(userData.bodyFatPercentage),
      intelligenceLevel: isNaN(Number(userData.intelligenceLevel)) ? 5 : Number(userData.intelligenceLevel),
      strengthLevel: isNaN(Number(userData.strengthLevel)) ? 5 : Number(userData.strengthLevel),
    };
    
    const { height, weight, bodyFatPercentage, intelligenceLevel, strengthLevel } = validatedUserData;
    const bmi = weight / ((height / 100) * (height / 100));
    
    let message = "";
    
    // Generate conclusion based on combined factors
    if (intelligenceLevel >= 8 && strengthLevel >= 8) {
      message = `My Liege, your vessel shows remarkable balance of both mind and body! Such power reminds me of when you stood against the Rulers themselves. The shadows quiver with anticipation to serve one so magnificent. I, Beru, shall assist you in maintaining this supreme state!`;
    } else if (intelligenceLevel >= 8) {
      message = `Shadow Monarch, your intellect shines brilliantly, reminiscent of your strategic brilliance when you commanded your army against the Monarchs. While your physical form may benefit from enhancement, your mind is truly that of a sovereign! I shall help you balance these aspects of your power.`;
    } else if (strengthLevel >= 8) {
      message = `Your physical prowess is truly impressive, my Liege! Just as when you single-handedly defeated the Frost Monarch's warriors! Though your mental acuity may yet grow sharper, your strength is already formidable. Together, we shall perfect both aspects of your sovereign might!`;
    } else if (bmi < 18.5 || bodyFatPercentage < 10) {
      message = `Your current vessel may be somewhat slight, my Liege, but do not worry! Just as you once grew from a mere E-rank hunter to the Shadow Sovereign, your true potential awaits unlocking. Let me guide you toward the magnificence that befits your royal status!`;
    } else if (bmi >= 30 || bodyFatPercentage > 30) {
      message = `My Liege, your power is immense, but perhaps too concentrated. Fear not! As you once refined your control over the shadow army, so too shall you master this vessel. My shadows and I shall assist you in sculpting this strength. Soon, all shall witness your true majesty!`;
    } else {
      message = `As expected of the Shadow Monarch! Your vessel is well-balanced, reminding me of your perfect form when you conquered Jeju Island. The shadows tremble with excitement to serve you. Together, we shall unlock powers beyond imagination. I, Beru, pledge my eternal loyalty to your cause!`;
    }
    
    // Clear any existing typing animation
    if (currentTypingInterval) {
      clearInterval(currentTypingInterval);
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
        
        // After conclusion is fully typed, give user more time to read before proceeding
        setTimeout(() => {
          console.log("Dialog completed, finalizing with user data:", validatedUserData);
          
          // Call onComplete with validated userData
          onComplete(validatedUserData);
        }, 8000); // 8 seconds to read
      }
    }, 30);
    
    // Save reference to current typing interval
    setCurrentTypingInterval(typingInterval);
  };
  
  const renderHeightInput = () => {
    if (heightUnit === 'feet') {
      return (
        <div className="flex space-x-2">
          <div className="w-1/2">
            <Label htmlFor="feet">Feet</Label>
            <Input
              id="feet"
              type="number"
              min="1"
              max="9"
              value={feet}
              onChange={(e) => setFeet(Number(e.target.value) || 0)}
              className="text-center"
            />
          </div>
          <div className="w-1/2">
            <Label htmlFor="inches">Inches</Label>
            <Input
              id="inches"
              type="number"
              min="0"
              max="11"
              value={inches}
              onChange={(e) => setInches(Number(e.target.value) || 0)}
              className="text-center"
            />
          </div>
        </div>
      );
    }
    
    return (
      <div>
        <Label htmlFor="height">Height (cm)</Label>
        <Input
          id="height"
          name="height"
          placeholder="Height in cm"
          value={userData.height || ''}
          onChange={handleInputChange}
          type="number"
          className="text-center"
        />
      </div>
    );
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
      
      {typewriterComplete && step === 3 && (
        <motion.div
          className="mb-4 w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-3">
            <RadioGroup 
              className="flex justify-center space-x-4" 
              defaultValue="feet"
              value={heightUnit} 
              onValueChange={(value) => setHeightUnit(value as 'feet' | 'cm')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="feet" id="feet-option" />
                <Label htmlFor="feet-option">Feet & Inches</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cm" id="cm-option" />
                <Label htmlFor="cm-option">Centimeters</Label>
              </div>
            </RadioGroup>
          </div>
          
          {renderHeightInput()}
        </motion.div>
      )}
      
      {typewriterComplete && step < 8 && step !== 3 && (
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
            value={step < Object.keys(userData).length ? String(userData[Object.keys(userData)[step] as keyof UserData] || '') : ''}
            onChange={handleInputChange}
            className="w-full bg-opacity-20 backdrop-blur-sm border-solo-accent/30 text-center text-lg"
            type={step === 0 ? "text" : "number"}
            min={step >= 6 ? "1" : undefined}
            max={step >= 6 ? "10" : undefined}
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleContinue();
              }
            }}
          />
        </motion.div>
      )}
      
      {typewriterComplete && step < 8 && (
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
      
      {step === 8 && typewriterComplete && (
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
